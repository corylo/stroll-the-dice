import firebase from "firebase-admin";
import { logger } from "firebase-functions";

import { db } from "../../../firebase";

import { MatchupUtility } from "../../utilities/matchupUtility";
import { PlayerUtility } from "../../utilities/playerUtility";
import { PointsUtility } from "../../utilities/pointsUtility";
import { PredictionUtility } from "../../utilities/predictionUtility";

import { IGame } from "../../../../stroll-models/game";
import { IMatchup, matchupConverter } from "../../../../stroll-models/matchup";
import { IMatchupSideStepUpdate } from "../../../../stroll-models/matchupSideStepUpdate";
import { IPlayer } from "../../../../stroll-models/player";
import { IPrediction } from "../../../../stroll-models/prediction";
import { MatchupTransactionService } from "./matchupTransactionService";

interface IPlayerTransactionService {
  handleMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, game: IGame, player: IPlayer) => void;
  completeDayOneMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, player: IPlayer) => void;
  createDayOneMatchup: (transaction: firebase.firestore.Transaction, player: IPlayer) => void;    
  distributePayoutsAndFinalizeSteps: (gameID: string, matchups: IMatchup[], updates: IMatchupSideStepUpdate[], predictions: IPrediction[]) => Promise<void>;
  distributePointsAndUpdateSteps: (gameID: string, matchups: IMatchup[], updates: IMatchupSideStepUpdate[]) => Promise<void>;
  updateCounts: (transaction: firebase.firestore.Transaction, gameRef: firebase.firestore.DocumentReference, game: IGame, player: IPlayer) => void;  
}

export const PlayerTransactionService: IPlayerTransactionService = {
  handleMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, game: IGame, player: IPlayer): void => {
    if(matchupSnap.empty || game.counts.players % 2 === 0) {
      PlayerTransactionService.createDayOneMatchup(transaction, player);
    } else if (matchupSnap.docs.length === 1) {
      PlayerTransactionService.completeDayOneMatchup(transaction, matchupSnap, player);
    }
  },
  completeDayOneMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, player: IPlayer): void => {      
    const matchups: IMatchup[] = [];

    matchupSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IMatchup>) => 
      matchups.push({ ...doc.data(), id: doc.id }));

    const matchup: IMatchup = matchups[0];

    logger.info(`Completing matchup [${matchup.id}] for player [${player.id}] in game [${player.ref.game}].`);

    const matchupRef: firebase.firestore.DocumentReference = MatchupUtility.getMatchupRef(player.ref.game, matchup.id);

    transaction.update(matchupRef, { ["right.ref"]: player.id });
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
            let player: IPlayer = PointsUtility.updatePointsForSteps(doc.data(), updates);
            
            const available: number = PredictionUtility.determineNewAvailablePoints(player, matchups, predictions),
              total: number = PredictionUtility.determineNewTotalPoints(player, matchups, predictions);

            transaction.update(doc.ref, { 
              points: {
                available,
                total
              },
              updatedAt: firebase.firestore.FieldValue.serverTimestamp() 
            });
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
            const player: IPlayer = PointsUtility.updatePointsForSteps(doc.data(), updates);

            transaction.update(doc.ref, {
              points: player.points,
              updatedAt: firebase.firestore.FieldValue.serverTimestamp() 
            });
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