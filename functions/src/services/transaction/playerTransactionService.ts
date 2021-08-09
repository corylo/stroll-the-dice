import firebase from "firebase-admin";
import { logger } from "firebase-functions";

import { db } from "../../../config/firebase";

import { FirestoreDateUtility } from "../../utilities/firestoreDateUtility";
import { GameEventService } from "../gameEventService";
import { GameEventTransactionService } from "./gameEventTransactionService";
import { MatchupTransactionService } from "./matchupTransactionService";
import { PredictionService } from "../predictionService";
import { PredictionTransactionService } from "./predictionTransactionService";

import { GameEventUtility } from "../../utilities/gameEventUtility";
import { MatchupUtility } from "../../utilities/matchupUtility";
import { PlayerUtility } from "../../utilities/playerUtility";
import { PointsUtility } from "../../utilities/pointsUtility";

import { IDayCompletedEvent } from "../../../../stroll-models/gameEvent/dayCompletedEvent";
import { gameConverter, IGame } from "../../../../stroll-models/game";
import { IMatchup, IMatchupSideTotal } from "../../../../stroll-models/matchup";
import { IMatchupSideStepUpdate } from "../../../../stroll-models/matchupSideStepUpdate";
import { IPlayer } from "../../../../stroll-models/player";
import { IPlayerDayCompletedSummaryEvent } from "../../../../stroll-models/gameEvent/playerDayCompletedSummaryEvent";
import { IPlayerEarnedPointsFromStepsEvent } from "../../../../stroll-models/gameEvent/playerEarnedPointsFromStepsEvent";
import { IPrediction } from "../../../../stroll-models/prediction";

import { InitialValue } from "../../../../stroll-enums/initialValue";

interface IPlayerTransactionService {
  handleMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, game: IGame, player: IPlayer) => void;
  completeDayOneMatchup: (transaction: firebase.firestore.Transaction, matchup: IMatchup, player: IPlayer) => IMatchup;
  createDayOneMatchup: (transaction: firebase.firestore.Transaction, player: IPlayer) => void;    
  distributePayoutsAndFinalizeSteps: (gameID: string, day: number, startsAt: firebase.firestore.FieldValue, matchups: IMatchup[], updates: IMatchupSideStepUpdate[]) => Promise<void>;
  distributePointsAndUpdateSteps: (gameID: string, matchups: IMatchup[], updates: IMatchupSideStepUpdate[]) => Promise<void>;
}

export const PlayerTransactionService: IPlayerTransactionService = {
  handleMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, game: IGame, player: IPlayer): void => {
    const matchups: IMatchup[] = [];

    if(!matchupSnap.empty) {
      matchupSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IMatchup>) => 
        matchups.push(doc.data()));
    }

    if(matchups.length === 0 || matchups[0].right.playerID !== "") {    
      PlayerTransactionService.createDayOneMatchup(transaction, player);
    } else {
      const matchup: IMatchup = PlayerTransactionService.completeDayOneMatchup(transaction, matchups[0], player);

      PredictionTransactionService.createInitialPredictions(transaction, game.id, matchup.id, matchup.left.playerID, player.id);
    }
  },
  completeDayOneMatchup: (transaction: firebase.firestore.Transaction, matchup: IMatchup, player: IPlayer): IMatchup => {    
    logger.info(`Completing matchup [${matchup.id}] for player [${player.id}] in game [${player.ref.game}].`);

    const matchupRef: firebase.firestore.DocumentReference = MatchupUtility.getMatchupRef(player.ref.game, matchup.id);

    const total: IMatchupSideTotal = {
      participants: 1,
      wagered: InitialValue.InitialPredictionPoints
    };
    
    transaction.update(matchupRef, { 
      ["left.total"]: total,
      ["right.total"]: total,
      ["right.playerID"]: player.id
    });

    return matchup;
  },
  createDayOneMatchup: (transaction: firebase.firestore.Transaction, player: IPlayer): void => {
    logger.info(`Creating matchup for player [${player.id}] in game [${player.ref.game}].`);

    const matchupRef: firebase.firestore.DocumentReference = MatchupUtility.getMatchupRef(player.ref.game);

    transaction.set(matchupRef, MatchupUtility.mapCreate(player.id, "", 1));
  },
  distributePayoutsAndFinalizeSteps: async (gameID: string, day: number, startsAt: firebase.firestore.FieldValue, matchups: IMatchup[], updates: IMatchupSideStepUpdate[]): Promise<void> => {
    const dayCompletedAt: firebase.firestore.FieldValue = FirestoreDateUtility.endOfDay(day, startsAt);

    const predictions: IPrediction[] = await PredictionService.getAllForMatchups(gameID, matchups);   

    try {
      const playersRef: firebase.firestore.Query = PlayerUtility.getPlayersRef(gameID);

      await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
        const playerSnap: firebase.firestore.QuerySnapshot = await transaction.get(playersRef);

        if(!playerSnap.empty) {   
          matchups = MatchupUtility.mapStepUpdates(matchups, updates);

          matchups = MatchupUtility.setWinners(matchups);
           
          playerSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IPlayer>) => {
            const update: IMatchupSideStepUpdate = MatchupUtility.findStepUpdate(doc.id, updates),
              player: IPlayer = PointsUtility.mapPointsForSteps(doc.data(), update);
          
            if(update.steps > 0) {
              const playerEarnedPointsFromStepsEvent: IPlayerEarnedPointsFromStepsEvent = GameEventUtility.mapPlayerEarnedPointsFromStepsEvent(
                player.id, 
                dayCompletedAt, 
                update.steps
              );

              GameEventTransactionService.create(transaction, gameID, playerEarnedPointsFromStepsEvent);
            }

            const playerDayCompletedSummaryEvent: IPlayerDayCompletedSummaryEvent = GameEventUtility.derivePlayerDayCompletedSummaryEvent(
              player.id,
              dayCompletedAt,
              day,
              matchups,
              predictions
            );

            const net: number = playerDayCompletedSummaryEvent.gained - playerDayCompletedSummaryEvent.lost;

            const updatedAt: firebase.firestore.FieldValue = firebase.firestore.FieldValue.serverTimestamp();

            transaction.update(doc.ref, { 
              points: {
                available: player.points.available + playerDayCompletedSummaryEvent.received,
                total: player.points.total + net
              },
              updatedAt
            });

            GameEventTransactionService.create(transaction, gameID, playerDayCompletedSummaryEvent)
          });

          MatchupTransactionService.updateAll(transaction, gameID, matchups);    
          
          const gameRef: firebase.firestore.DocumentReference<IGame> = db.collection("games")
            .doc(gameID)
            .withConverter<IGame>(gameConverter);

          transaction.update(gameRef, { progressUpdateAt: firebase.firestore.FieldValue.serverTimestamp() });     
        }
      });

      const dayCompletedEvent: IDayCompletedEvent = GameEventUtility.mapDayCompletedEvent(
        FirestoreDateUtility.addMillis(dayCompletedAt, 2), 
        day
      );
      
      await GameEventService.create(gameID, dayCompletedEvent);        
    } catch (err) {
      logger.error(err);
    }
  },
  distributePointsAndUpdateSteps: async (gameID: string, matchups: IMatchup[], updates: IMatchupSideStepUpdate[]): Promise<void> => {
    try {
      const playersRef: firebase.firestore.Query = PlayerUtility.getPlayersRef(gameID);

      await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
        const playerSnap: firebase.firestore.QuerySnapshot = await transaction.get(playersRef);

        if(!playerSnap.empty) {    
          matchups = MatchupUtility.mapStepUpdates(matchups, updates);

          playerSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IPlayer>) => {
            const update: IMatchupSideStepUpdate = MatchupUtility.findStepUpdate(doc.id, updates);

            if(update.steps > 0) {
              const player: IPlayer = PointsUtility.mapPointsForSteps(doc.data(), update);

              const updatedAt: firebase.firestore.FieldValue = firebase.firestore.FieldValue.serverTimestamp();

              transaction.update(doc.ref, {
                points: player.points,
                updatedAt
              });

              const event: IPlayerEarnedPointsFromStepsEvent = GameEventUtility.mapPlayerEarnedPointsFromStepsEvent(
                player.id, 
                FirestoreDateUtility.beginningOfHour(firebase.firestore.Timestamp.now()), 
                update.steps
              );

              GameEventTransactionService.create(transaction, gameID, event);
            }
          }); 

          MatchupTransactionService.updateAll(transaction, gameID, matchups);    

          const gameRef: firebase.firestore.DocumentReference<IGame> = db.collection("games")
            .doc(gameID)
            .withConverter<IGame>(gameConverter);

          transaction.update(gameRef, { progressUpdateAt: firebase.firestore.FieldValue.serverTimestamp() });
        }
      });
    } catch (err) {
      logger.error(err);
    }
  }
}