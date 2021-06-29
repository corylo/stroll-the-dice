import firebase from "firebase-admin";
import { EventContext, logger } from "firebase-functions";

import { db } from "../../firebase";

import { GameDurationUtility } from "../../../stroll-utilities/gameDurationUtility";

import { IGame } from "../../../stroll-models/game";
import { IGameUpdate } from "../../../stroll-models/gameUpdate";

import { GameStatus } from "../../../stroll-enums/gameStatus";

interface IScheduleService {  
  updateGameStatuses: (context: EventContext) => Promise<void>;
}

export const ScheduleService: IScheduleService = {
  updateGameStatuses: async (context: EventContext): Promise<void> => {
    try {
      const batch: firebase.firestore.WriteBatch = db.batch();

      const upcomingSnap: firebase.firestore.QuerySnapshot = await db.collection("games")
        .where("startsAt", "<=", firebase.firestore.Timestamp.now())
        .where("status", "==", GameStatus.Upcoming)
        .get();

      if(!upcomingSnap.empty) {
        logger.info(`Updating [${upcomingSnap.size}] games from [${GameStatus.Upcoming}] to [${GameStatus.InProgress}]`);

        upcomingSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {          
          batch.update(doc.ref, { locked: true, status: GameStatus.InProgress });
        });
      }

      const inProgressSnap: firebase.firestore.QuerySnapshot = await db.collection("games")       
        .where("status", "==", GameStatus.InProgress)
        .get();

      if(!inProgressSnap.empty) {
        logger.info(`[${inProgressSnap.size}] games are in progress.`);

        let completedGamesCount: number = 0,
          updatedGamesCount: number = 0;

        inProgressSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {          
          const game: IGame = doc.data(),
            updates: IGameUpdate = {};

          if (GameDurationUtility.completed(game)) {
            updates.status = GameStatus.Completed;

            completedGamesCount++;
          } else {
            updates.progressUpdateAt = firebase.firestore.FieldValue.serverTimestamp();

            updatedGamesCount++;
          }

          batch.update(doc.ref, updates);
        });
                  
        logger.info(`Updating progress of [${updatedGamesCount}] games. Updating [${completedGamesCount}] games from [${GameStatus.InProgress}] to [${GameStatus.Completed}].`);
      }
        
      const results: firebase.firestore.WriteResult[] = await batch.commit();

      logger.info(`Successfully updated [${results.length}] games.`);
    } catch (err) {
      logger.error(err);
    }
  }
}