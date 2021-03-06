import firebase from "firebase-admin";
import { EventContext, logger } from "firebase-functions";

import { db } from "../../config/firebase";

import { GameBatchService } from "./batch/gameBatchService";

import { ScheduleUtility } from "../utilities/scheduleUtility";

import { gameConverter, IGame } from "../../../stroll-models/game";

import { FirebaseDocumentID } from "../../../stroll-enums/firebaseDocumentID";
import { GameStatus } from "../../../stroll-enums/gameStatus";
import { GameError } from "../../../stroll-enums/gameError";

interface IScheduleService {  
  handleInProgress: (snap: firebase.firestore.QuerySnapshot) => Promise<void>;
  handleInProgressToCompleted: (snap: firebase.firestore.QuerySnapshot) => Promise<void>;
  handleUpcomingToInProgress: (snap: firebase.firestore.QuerySnapshot) => Promise<void>;  
  scheduledGameUpdate: (context: EventContext) => Promise<void>;
}

export const ScheduleService: IScheduleService = {
  handleInProgress: async (snap: firebase.firestore.QuerySnapshot): Promise<void> => {  
    if(!snap.empty) {
      logger.info(`Updating progress of [${snap.size}] games.`);

      await GameBatchService.handleInProgress(snap);
    }
  },
  handleInProgressToCompleted: async (snap: firebase.firestore.QuerySnapshot): Promise<void> => {
    if(!snap.empty) {
      logger.info(`Updating [${snap.size}] games from [${GameStatus.InProgress}] to [${GameStatus.Completed}]`);

      await GameBatchService.handleInProgressToCompleted(snap);
    }      
  },
  handleUpcomingToInProgress: async (snap: firebase.firestore.QuerySnapshot): Promise<void> => {
    if(!snap.empty) {
      logger.info(`Updating [${snap.size}] games from [${GameStatus.Upcoming}] to [${GameStatus.InProgress}]`);

      await GameBatchService.handleUpcomingToInProgress(snap);
    }
  },
  scheduledGameUpdate: async (context: EventContext): Promise<void> => {
    if(!ScheduleUtility.isScheduledGameUpdateWarmupRun(context)) {
      try {  
        const upcomingGamesSnap: firebase.firestore.QuerySnapshot = await db.collection("games")
          .where("startsAt", "<=", firebase.firestore.Timestamp.now())
          .where("status", "==", GameStatus.Upcoming)
          .where("error", "==", GameError.None)
          .withConverter(gameConverter)
          .get();

        const inProgressGamesSnap: firebase.firestore.QuerySnapshot = await db.collection("games")     
          .where("endsAt", ">", firebase.firestore.Timestamp.now())  
          .where("status", "==", GameStatus.InProgress)
          .withConverter(gameConverter)
          .get();

        const completedGamesSnap: firebase.firestore.QuerySnapshot = await db.collection("games")     
          .where("endsAt", "<=", firebase.firestore.Timestamp.now())  
          .where("status", "==", GameStatus.InProgress)
          .withConverter(gameConverter)
          .get();

        await Promise.all([
          ScheduleService.handleUpcomingToInProgress(upcomingGamesSnap),
          ScheduleService.handleInProgress(inProgressGamesSnap),
          ScheduleService.handleInProgressToCompleted(completedGamesSnap)
        ]);
      } catch (err) {
        logger.error(err);
      }
    } else {   
      await db.collection("games")
        .doc(FirebaseDocumentID.WarmUp)
        .withConverter<IGame>(gameConverter)
        .update({ updatedAt: firebase.firestore.Timestamp.now() });
    }
  }
}