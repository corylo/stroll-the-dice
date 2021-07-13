import firebase from "firebase-admin";
import { EventContext, logger } from "firebase-functions";

import { db } from "../../firebase";

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
    const batch: firebase.firestore.WriteBatch = db.batch();

    const gamesInProgressSnap: firebase.firestore.QuerySnapshot = await db.collection("games")     
      .where("endsAt", ">", firebase.firestore.Timestamp.now())  
      .where("status", "==", GameStatus.InProgress)
      .get();

    if(!gamesInProgressSnap.empty) {
      logger.info(`[${gamesInProgressSnap.size}] games are in progress.`);

      gamesInProgressSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {      
        batch.update(doc.ref, {
          progressUpdateAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });
    }
      
    await batch.commit();
  },
  handleInProgressToCompleted: async (): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    const gamesCompletedSnap: firebase.firestore.QuerySnapshot = await db.collection("games")     
      .where("endsAt", "<=", firebase.firestore.Timestamp.now())  
      .where("status", "==", GameStatus.InProgress)
      .get();

    if(!gamesCompletedSnap.empty) {
      logger.info(`Updating [${gamesCompletedSnap.size}] games from [${GameStatus.InProgress}] to [${GameStatus.Completed}]`);

      gamesCompletedSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {      
        batch.update(doc.ref, {
          progressUpdateAt: firebase.firestore.FieldValue.serverTimestamp(),
          status: GameStatus.Completed
        });
      });

      await batch.commit();
    }      
  },
  handleUpcomingToInProgress: async (): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    const upcomingGamesSnap: firebase.firestore.QuerySnapshot = await db.collection("games")
      .where("startsAt", "<=", firebase.firestore.Timestamp.now())
      .where("status", "==", GameStatus.Upcoming)
      .get();

    if(!upcomingGamesSnap.empty) {
      logger.info(`Updating [${upcomingGamesSnap.size}] games from [${GameStatus.Upcoming}] to [${GameStatus.InProgress}]`);

      upcomingGamesSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {          
        batch.update(doc.ref, {             
          locked: true, 
          progressUpdateAt: firebase.firestore.FieldValue.serverTimestamp(),
          status: GameStatus.InProgress 
        });
      });

      await batch.commit();
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