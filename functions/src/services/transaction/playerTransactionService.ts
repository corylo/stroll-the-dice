import firebase from "firebase-admin";
import { logger } from "firebase-functions";

import { db } from "../../../firebase";

import { GameEventTransactionService } from "./gameEventTransactionService";
import { MatchupTransactionService } from "./matchupTransactionService";
import { PredictionTransactionService } from "./predictionTransactionService";

import { GameEventUtility } from "../../../../stroll-utilities/gameEventUtility";
import { MatchupUtility } from "../../utilities/matchupUtility";
import { PlayerUtility } from "../../utilities/playerUtility";
import { PointsUtility } from "../../utilities/pointsUtility";
import { PredictionUtility } from "../../utilities/predictionUtility";

import { IGame } from "../../../../stroll-models/game";
import { IMatchup, IMatchupSideTotal } from "../../../../stroll-models/matchup";
import { IMatchupSideStepUpdate } from "../../../../stroll-models/matchupSideStepUpdate";
import { IPlayer } from "../../../../stroll-models/player";
import { IPrediction } from "../../../../stroll-models/prediction";

import { InitialValue } from "../../../../stroll-enums/initialValue";

interface IPlayerTransactionService {
  handleMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, game: IGame, player: IPlayer) => void;
  completeDayOneMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, player: IPlayer) => IMatchup;
  createDayOneMatchup: (transaction: firebase.firestore.Transaction, player: IPlayer) => void;    
  distributePayoutsAndFinalizeSteps: (gameID: string, matchups: IMatchup[], updates: IMatchupSideStepUpdate[], predictions: IPrediction[]) => Promise<void>;
  distributePointsAndUpdateSteps: (gameID: string, matchups: IMatchup[], updates: IMatchupSideStepUpdate[]) => Promise<void>;
  updateCounts: (transaction: firebase.firestore.Transaction, gameRef: firebase.firestore.DocumentReference, game: IGame, player: IPlayer) => void;  
}

export const PlayerTransactionService: IPlayerTransactionService = {
  handleMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, game: IGame, player: IPlayer): void => {
    if(matchupSnap.empty || game.counts.players % 2 === 0) {    
      PlayerTransactionService.createDayOneMatchup(transaction, player);
    } else {
      const matchup: IMatchup = PlayerTransactionService.completeDayOneMatchup(transaction, matchupSnap, player);

      PredictionTransactionService.createInitialPredictions(transaction, game.id, matchup.id, matchup.left.ref, player.id);
    }
  },
  completeDayOneMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, player: IPlayer): IMatchup => {      
    const matchups: IMatchup[] = [];

    matchupSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IMatchup>) => 
      matchups.push(doc.data()));

    const matchup: IMatchup = matchups[0];

    logger.info(`Completing matchup [${matchup.id}] for player [${player.id}] in game [${player.ref.game}].`);

    const matchupRef: firebase.firestore.DocumentReference = MatchupUtility.getMatchupRef(player.ref.game, matchup.id);

    const total: IMatchupSideTotal = {
      participants: 1,
      wagered: InitialValue.InitialPredictionPoints
    };
    
    transaction.update(matchupRef, { 
      ["left.total"]: total,
      ["right.total"]: total,
      ["right.ref"]: player.id 
    });

    return matchup;
  },
  createDayOneMatchup: (transaction: firebase.firestore.Transaction, player: IPlayer): void => {
    logger.info(`Creating matchup for player [${player.id}] in game [${player.ref.game}].`);

    const matchupRef: firebase.firestore.DocumentReference = MatchupUtility.getMatchupRef(player.ref.game);

    transaction.set(matchupRef, MatchupUtility.mapCreate(player.id, "", 1));
  },
  distributePayoutsAndFinalizeSteps: async (gameID: string, matchups: IMatchup[], updates: IMatchupSideStepUpdate[], predictions: IPrediction[]): Promise<void> => {
    try {
      const playersRef: firebase.firestore.Query = PlayerUtility.getPlayersRef(gameID);

      await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
        const playerSnap: firebase.firestore.QuerySnapshot = await transaction.get(playersRef);

        if(!playerSnap.empty) {   
          matchups = MatchupUtility.mapStepUpdates(matchups, updates);

          matchups = MatchupUtility.setWinners(matchups);
           
          playerSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IPlayer>) => {
            const update: IMatchupSideStepUpdate = MatchupUtility.findStepUpdate(doc.id, updates);

            if(update) {
              const player: IPlayer = PointsUtility.updatePointsForSteps(doc.data(), update);
            
              const available: number = PredictionUtility.determineNewAvailablePoints(player, matchups, predictions),
                total: number = PredictionUtility.determineNewTotalPoints(player, matchups, predictions);

              const updatedAt: firebase.firestore.FieldValue = firebase.firestore.FieldValue.serverTimestamp();

              transaction.update(doc.ref, { 
                points: {
                  available,
                  total
                },
                updatedAt
              });
            }
          });

          MatchupTransactionService.updateAll(transaction, gameID, matchups);          
        }
      });
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

            if(update && update.steps > 0) {
              const player: IPlayer = PointsUtility.updatePointsForSteps(doc.data(), update);

              const updatedAt: firebase.firestore.FieldValue = firebase.firestore.FieldValue.serverTimestamp();

              transaction.update(doc.ref, {
                points: player.points,
                updatedAt
              });

              GameEventTransactionService.create(
                transaction, 
                gameID, 
                GameEventUtility.mapPlayerEarnedPointsFromStepsEvent(player.id, updatedAt, update.steps)
              );
            }
          }); 

          MatchupTransactionService.updateAll(transaction, gameID, matchups);    
        }
      });
    } catch (err) {
      logger.error(err);
    }
  },
  updateCounts: (transaction: firebase.firestore.Transaction, gameRef: firebase.firestore.DocumentReference, game: IGame, player: IPlayer): void => {      
    if(player.id !== game.creator.uid) { 
      transaction.update(gameRef, { ["counts.players"]: firebase.firestore.FieldValue.increment(1) });

      const inviteRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(player.ref.game)
        .collection("invites")
        .doc(player.ref.invite);
        
      transaction.update(inviteRef, { ["uses.current"]: firebase.firestore.FieldValue.increment(1) });
    }
  }
}