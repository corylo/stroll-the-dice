import firebase from "firebase-admin";
import { logger } from "firebase-functions";

import { db } from "../../../firebase";

import { ProfileUtility } from "../../utilities/profileUtility";

import { IGame } from "../../../../stroll-models/game";
import { IProfileUpdate } from "../../../../stroll-models/profileUpdate";

import { GameStatus } from "../../../../stroll-enums/gameStatus";

interface IGameBatchService {
  handleInProgress: (inProgressGamesSnap: firebase.firestore.QuerySnapshot) => Promise<void>;
  handleInProgressLoop: (docs: FirebaseFirestore.QueryDocumentSnapshot[]) => Promise<void>;
  handleInProgressToCompleted: (completedGamesSnap: firebase.firestore.QuerySnapshot) => Promise<void>;
  handleInProgressToCompletedLoop: (docs: FirebaseFirestore.QueryDocumentSnapshot[]) => Promise<void>;
  handleUpcomingToInProgress: (upcomingGamesSnap: firebase.firestore.QuerySnapshot) => Promise<void>;
  handleUpcomingToInProgressLoop: (docs: FirebaseFirestore.QueryDocumentSnapshot[]) => Promise<void>;
  updateCreator: (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate) => Promise<void>;
}

export const GameBatchService: IGameBatchService = {
  handleInProgress: async (inProgressGamesSnap: firebase.firestore.QuerySnapshot): Promise<void> => {
    const { length } = inProgressGamesSnap.docs;

    let loopIndex: number = 1;

    for(let i: number = 0; i < inProgressGamesSnap.docs.length; i += 500) {
      const min: number = i,
        max: number = i + 500,
        adjustedMax: number = Math.min(max, length);

      logger.info(`Loop [${loopIndex++}]: Updating progress of games [${min + 1} - ${adjustedMax}]`);

      const docs: FirebaseFirestore.QueryDocumentSnapshot[] = inProgressGamesSnap.docs.slice(min, max);
      
      await GameBatchService.handleInProgressLoop(docs);
    }
  },
  handleInProgressLoop: async (docs: FirebaseFirestore.QueryDocumentSnapshot[]): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {      
      batch.update(doc.ref, {
        progressUpdateAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });

    await batch.commit();
  },
  handleInProgressToCompleted: async (completedGamesSnap: firebase.firestore.QuerySnapshot): Promise<void> => {
    const { length } = completedGamesSnap.docs;

    let loopIndex: number = 1;

    for(let i: number = 0; i < length; i += 250) {
      const min: number = i,
        max: number = i + 250,
        adjustedMax: number = Math.min(max, length);

      logger.info(`Loop [${loopIndex++}]: Updating games [${min + 1} - ${adjustedMax}] from [${GameStatus.InProgress}] to [${GameStatus.Completed}]`);

      const docs: FirebaseFirestore.QueryDocumentSnapshot[] = completedGamesSnap.docs.slice(min, max);
      
      await GameBatchService.handleInProgressToCompletedLoop(docs);
    }
  },
  handleInProgressToCompletedLoop: async (docs: FirebaseFirestore.QueryDocumentSnapshot[]): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {   
      batch.update(doc.ref, {
        progressUpdateAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: GameStatus.Completed
      });
    });

    await batch.commit();
  },
  handleUpcomingToInProgress: async (upcomingGamesSnap: firebase.firestore.QuerySnapshot): Promise<void> => {
    const { length } = upcomingGamesSnap.docs;

    let loopIndex: number = 1;

    for(let i: number = 0; i < length; i += 250) {
      const min: number = i,
        max: number = i + 250,
        adjustedMax: number = Math.min(max, length);

      logger.info(`Loop [${loopIndex++}]: Updating games [${min + 1} - ${adjustedMax}] from [${GameStatus.Upcoming}] to [${GameStatus.InProgress}]`);

      const docs: FirebaseFirestore.QueryDocumentSnapshot[] = upcomingGamesSnap.docs.slice(min, max);

      await GameBatchService.handleUpcomingToInProgressLoop(docs);
    }
  },
  handleUpcomingToInProgressLoop: async (docs: FirebaseFirestore.QueryDocumentSnapshot[]): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {      
      batch.update(doc.ref, {             
        locked: true, 
        progressUpdateAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: GameStatus.InProgress 
      });
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