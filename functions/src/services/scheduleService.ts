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
      const gameSnap: firebase.firestore.QuerySnapshot = await db.collection("games")
        .where("startsAt", "<=", Date.now())
        .where("status", "!=", GameStatus.Completed)
        .get();

      if(!gameSnap.empty) {
        const batch: firebase.firestore.WriteBatch = db.batch();
    
        gameSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {
          const game: IGame = doc.data(),
            updates: IGameUpdate = {};

          if(game.status === GameStatus.Upcoming) {
            updates.locked = true;
            updates.status = GameStatus.InProgress;
          } else if (game.status === GameStatus.InProgress && GameDurationUtility.completed(game)) {
            updates.status = GameStatus.Completed;
          } else {
            updates.progressUpdateAt = firebase.firestore.FieldValue.serverTimestamp();
          }

          batch.update(doc.ref, updates);
        });
        
        const results: firebase.firestore.WriteResult[] = await batch.commit();

        logger.info(`Successfully updated ${results.length} games.`);
      } else {
        logger.info("No games to update.");
      }
    } catch (err) {
      logger.error(err);
    }
  }
}