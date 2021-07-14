import firebase from "firebase-admin";
import { logger } from "firebase-functions";

import { db } from "../../../firebase";

import { GameEventBatchService } from "./gameEventBatchService";

import { GameEventUtility } from "../../../../stroll-utilities/gameEventUtility";
import { ProfileUtility } from "../../utilities/profileUtility";

import { IGame } from "../../../../stroll-models/game";
import { IProfileUpdate } from "../../../../stroll-models/profileUpdate";

import { GameEventType } from "../../../../stroll-enums/gameEventType";
import { GameStatus } from "../../../../stroll-enums/gameStatus";

interface IGameBatchService {
  handleInProgressToCompleted: (completedGamesSnap: firebase.firestore.QuerySnapshot) => Promise<void>;
  handleInProgressToCompletedLoop: (docs: FirebaseFirestore.QueryDocumentSnapshot[]) => Promise<void>;
  handleUpcomingToInProgress: (upcomingGamesSnap: firebase.firestore.QuerySnapshot) => Promise<void>;
  handleUpcomingToInProgressLoop: (docs: FirebaseFirestore.QueryDocumentSnapshot[]) => Promise<void>;
  updateCreator: (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate) => Promise<void>;
}

export const GameBatchService: IGameBatchService = {
  handleInProgressToCompleted: async (completedGamesSnap: firebase.firestore.QuerySnapshot): Promise<void> => {
    for(let i: number = 0; i < completedGamesSnap.docs.length; i += 250) {
      const min: number = i,
        max: number = i + 250;

      logger.info(`Updating games [${min} - ${max}] from [${GameStatus.InProgress}] to [${GameStatus.Completed}]`);

      const docs: FirebaseFirestore.QueryDocumentSnapshot[] = completedGamesSnap.docs.slice(min, max);
      
      await GameBatchService.handleInProgressToCompletedLoop(docs);
    }
  },
  handleInProgressToCompletedLoop: async (docs: FirebaseFirestore.QueryDocumentSnapshot[]): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {            
      const game: IGame = doc.data();

      batch.update(doc.ref, {
        progressUpdateAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: GameStatus.Completed
      });

      GameEventBatchService.create(batch, doc.id, GameEventUtility.mapGeneralEvent(game.endsAt, GameEventType.Completed));
    });

    await batch.commit();
  },
  handleUpcomingToInProgress: async (upcomingGamesSnap: firebase.firestore.QuerySnapshot): Promise<void> => {
    for(let i: number = 0; i < upcomingGamesSnap.docs.length; i += 250) {
      const min: number = i,
        max: number = i + 250;

      logger.info(`Updating games [${min} - ${max}] from [${GameStatus.Upcoming}] to [${GameStatus.InProgress}]`);

      const docs: FirebaseFirestore.QueryDocumentSnapshot[] = upcomingGamesSnap.docs.slice(min, max);

      await GameBatchService.handleUpcomingToInProgressLoop(docs);
    }
  },
  handleUpcomingToInProgressLoop: async (docs: FirebaseFirestore.QueryDocumentSnapshot[]): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {          
      const game: IGame = doc.data();

      batch.update(doc.ref, {             
        locked: true, 
        progressUpdateAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: GameStatus.InProgress 
      });

      GameEventBatchService.create(batch, doc.id, GameEventUtility.mapGeneralEvent(game.startsAt, GameEventType.Started));
    });

    await batch.commit();
  },
  updateCreator: async (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate): Promise<void> => {    
    const gameSnap: firebase.firestore.QuerySnapshot = await db.collection("games")
      .where("creator.uid", "==", uid)
      .where("status", "==", GameStatus.Upcoming)
      .get();

    gameSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {
      const game: IGame = doc.data();

      batch.update(doc.ref, { creator: ProfileUtility.applyUpdate(game.creator, update) });
    });
  }
}