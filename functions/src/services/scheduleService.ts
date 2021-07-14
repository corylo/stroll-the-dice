import firebase from "firebase-admin";
import { EventContext, logger } from "firebase-functions";

import { db } from "../../firebase";

import { GameBatchService } from "./batch/gameBatchService";

import { IGame } from "../../../stroll-models/game";

import { GameStatus } from "../../../stroll-enums/gameStatus";

interface IScheduleService {  
  handleInProgress: () => Promise<void>;
  handleInProgressToCompleted: () => Promise<void>;
  handleUpcomingToInProgress: () => Promise<void>;  
  scheduledGameUpdate: (context: EventContext) => Promise<void>;
}

export const ScheduleService: IScheduleService = {
  handleInProgress: async (): Promise<void> => {    
    const inProgressGamesSnap: firebase.firestore.QuerySnapshot = await db.collection("games")     
      .where("endsAt", ">", firebase.firestore.Timestamp.now())  
      .where("status", "==", GameStatus.InProgress)
      .get();

    if(!inProgressGamesSnap.empty) {
      logger.info(`Updating progress of [${inProgressGamesSnap.size}] games.`);

      await GameBatchService.handleInProgress(inProgressGamesSnap);
    }
  },
  handleInProgressToCompleted: async (): Promise<void> => {
    const completedGamesSnap: firebase.firestore.QuerySnapshot = await db.collection("games")     
      .where("endsAt", "<=", firebase.firestore.Timestamp.now())  
      .where("status", "==", GameStatus.InProgress)
      .get();

    if(!completedGamesSnap.empty) {
      logger.info(`Updating [${completedGamesSnap.size}] games from [${GameStatus.InProgress}] to [${GameStatus.Completed}]`);

      await GameBatchService.handleInProgressToCompleted(completedGamesSnap);
    }      
  },
  handleUpcomingToInProgress: async (): Promise<void> => {
    const upcomingGamesSnap: firebase.firestore.QuerySnapshot = await db.collection("games")
      .where("startsAt", "<=", firebase.firestore.Timestamp.now())
      .where("status", "==", GameStatus.Upcoming)
      .get();

    if(!upcomingGamesSnap.empty) {
      logger.info(`Updating [${upcomingGamesSnap.size}] games from [${GameStatus.Upcoming}] to [${GameStatus.InProgress}]`);

      await GameBatchService.handleUpcomingToInProgress(upcomingGamesSnap);
    }
  },
  scheduledGameUpdate: async (context: EventContext): Promise<void> => {
    try {
      await ScheduleService.handleUpcomingToInProgress();
      
      await ScheduleService.handleInProgress();

      await ScheduleService.handleInProgressToCompleted();
    } catch (err) {
      logger.error(err);
    }
  }
}