import firebase from "firebase-admin";
import { logger } from "firebase-functions";

import { db } from "../../../config/firebase";

import { GameEventService } from "../gameEventService";
import { PlayerTransactionService } from "./playerTransactionService";
import { PredictionService } from "../predictionService";

import { FirestoreDateUtility } from "../../utilities/firestoreDateUtility";
import { GameDaySummaryUtility } from "../../utilities/gameDaySummaryUtility";
import { GameEventUtility } from "../../utilities/gameEventUtility";
import { PlayerUtility } from "../../utilities/playerUtility";

import { IDayCompletedEvent } from "../../../../stroll-models/gameEvent/dayCompletedEvent";
import { gameConverter, IGame } from "../../../../stroll-models/game";
import { gameDaySummaryConverter, IGameDaySummary } from "../../../../stroll-models/gameDaySummary";
import { IPlayerStepUpdate } from "../../../../stroll-models/playerStepUpdate";
import { IPrediction } from "../../../../stroll-models/prediction";

interface IGameTransactionService {
  handleDayCompleteProgressUpdate: (gameID: string, day: number, startsAt: firebase.firestore.FieldValue, summary: IGameDaySummary, updates: IPlayerStepUpdate[]) => Promise<void>;
  handleProgressUpdate: (gameID: string, summary: IGameDaySummary, updates: IPlayerStepUpdate[]) => Promise<void>;
}

export const GameTransactionService: IGameTransactionService = {
  handleDayCompleteProgressUpdate: async (gameID: string, day: number, startsAt: firebase.firestore.FieldValue, summary: IGameDaySummary, updates: IPlayerStepUpdate[]): Promise<void> => {
    try {
      const dayCompletedAt: firebase.firestore.FieldValue = FirestoreDateUtility.endOfDay(day, startsAt);

      const playersRef: firebase.firestore.Query = PlayerUtility.getPlayersRef(gameID);

      const gameRef: firebase.firestore.DocumentReference<IGame> = db.collection("games")
        .doc(gameID)
        .withConverter<IGame>(gameConverter);

      const gameDaySummaryRef: firebase.firestore.DocumentReference<IGameDaySummary> = db.collection("games")
        .doc(gameID)
        .collection("day_summaries")
        .doc(summary.day.toString())
        .withConverter<IGameDaySummary>(gameDaySummaryConverter);

      const predictions: IPrediction[] = await PredictionService.getAllForMatchups(gameID, summary.matchups),
        finalizedSummary: IGameDaySummary = GameDaySummaryUtility.mapWinners(summary);
        
      await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
        const playerSnap: firebase.firestore.QuerySnapshot = await transaction.get(playersRef);

        PlayerTransactionService.handlePlayerEarnedPointsAtEndOfDay(
          transaction, 
          gameID, 
          playerSnap, 
          finalizedSummary.matchups,
          predictions,
          updates, 
          day,
          dayCompletedAt
        );

        transaction.update(gameDaySummaryRef, finalizedSummary);
        
        transaction.update(gameRef, { progressUpdateAt: firebase.firestore.FieldValue.serverTimestamp() });
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
  handleProgressUpdate: async (gameID: string, summary: IGameDaySummary, updates: IPlayerStepUpdate[]): Promise<void> => {
    try {
      const playersRef: firebase.firestore.Query = PlayerUtility.getPlayersRef(gameID);

      const gameRef: firebase.firestore.DocumentReference<IGame> = db.collection("games")
        .doc(gameID)
        .withConverter<IGame>(gameConverter);

      const gameDaySummaryRef: firebase.firestore.DocumentReference<IGameDaySummary> = db.collection("games")
        .doc(gameID)
        .collection("day_summaries")
        .doc(summary.day.toString())
        .withConverter<IGameDaySummary>(gameDaySummaryConverter);

      await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
        const playerSnap: firebase.firestore.QuerySnapshot = await transaction.get(playersRef);

        PlayerTransactionService.handlePlayerEarnedPointsForSteps(transaction, gameID, playerSnap, updates);
        
        transaction.update(gameDaySummaryRef, summary);
        
        transaction.update(gameRef, { progressUpdateAt: firebase.firestore.FieldValue.serverTimestamp() });
      });
    } catch (err) {
      logger.error(err);
    }
  }
}