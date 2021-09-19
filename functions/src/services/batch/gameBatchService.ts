import firebase from "firebase-admin";
import { logger } from "firebase-functions";

import { db } from "../../../config/firebase";

import { ProfileUtility } from "../../utilities/profileUtility";

import { IGame } from "../../../../stroll-models/game";
import { IGameUpdate } from "../../../../stroll-models/gameUpdate";
import { deletedProfileReference } from "../../../../stroll-models/profileReference";
import { IProfileUpdate } from "../../../../stroll-models/profileUpdate";

import { GameError } from "../../../../stroll-enums/gameError";
import { GameStatus } from "../../../../stroll-enums/gameStatus";

interface IGameBatchService {
  deleteCreatorFromAllGames: (uid: string) => Promise<void>;
  handleInProgress: (inProgressGamesSnap: firebase.firestore.QuerySnapshot) => Promise<void>;
  handleInProgressLoop: (docs: FirebaseFirestore.QueryDocumentSnapshot[]) => Promise<void>;
  handleInProgressToCompleted: (completedGamesSnap: firebase.firestore.QuerySnapshot) => Promise<void>;
  handleInProgressToCompletedLoop: (docs: FirebaseFirestore.QueryDocumentSnapshot[]) => Promise<void>;
  handleUpcomingToInProgress: (upcomingGamesSnap: firebase.firestore.QuerySnapshot) => Promise<void>;
  handleUpcomingToInProgressLoop: (docs: FirebaseFirestore.QueryDocumentSnapshot[]) => Promise<void>;  
  updateCreator: (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate) => Promise<void>;
}

export const GameBatchService: IGameBatchService = {
  deleteCreatorFromAllGames: async (uid: string): Promise<void> => {
    const gameSnap: firebase.firestore.QuerySnapshot = await db.collection("games")
      .where("creator.uid", "==", uid)
      .get();

    if(!gameSnap.empty) {
      let loopIndex: number = 1;
  
      const { length } = gameSnap.docs;
        
      for(let i: number = 0; i < length; i += 500) {
        const min: number = i,
          max: number = i + 500,
          adjustedMax: number = Math.min(max, length);

        logger.info(`Loop [${loopIndex++}]: Removing creator profile data from games [${min + 1} - ${adjustedMax}] for user [${uid}]`);

        const docs: FirebaseFirestore.QueryDocumentSnapshot[] = gameSnap.docs.slice(min, max);
        
        const batch: firebase.firestore.WriteBatch = db.batch();

        docs.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => batch.update(doc.ref, {
          ...doc.data(),
          creator: {
            ...deletedProfileReference(uid),            
            deletedAt: firebase.firestore.FieldValue.serverTimestamp()
          }
        }));

        await batch.commit();
      }
    }
  },
  handleInProgress: async (inProgressGamesSnap: firebase.firestore.QuerySnapshot): Promise<void> => {
    const { length } = inProgressGamesSnap.docs;

    let loopIndex: number = 1,
      requests: any[] = [];

    for(let i: number = 0; i < length; i += 500) {
      const min: number = i,
        max: number = i + 500,
        adjustedMax: number = Math.min(max, length);

      logger.info(`Loop [${loopIndex++}]: Updating progress of games [${min + 1} - ${adjustedMax}]`);

      const docs: FirebaseFirestore.QueryDocumentSnapshot[] = inProgressGamesSnap.docs.slice(min, max);
      
      requests.push(GameBatchService.handleInProgressLoop(docs));
    }

    await Promise.all(requests);
  },
  handleInProgressLoop: async (docs: FirebaseFirestore.QueryDocumentSnapshot[]): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {      
      batch.update(doc.ref, {
        initializeProgressUpdateAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });

    await batch.commit();
  },
  handleInProgressToCompleted: async (completedGamesSnap: firebase.firestore.QuerySnapshot): Promise<void> => {
    const { length } = completedGamesSnap.docs;

    let loopIndex: number = 1,
      requests: any[] = [];

    for(let i: number = 0; i < length; i += 250) {
      const min: number = i,
        max: number = i + 250,
        adjustedMax: number = Math.min(max, length);

      logger.info(`Loop [${loopIndex++}]: Updating games [${min + 1} - ${adjustedMax}] from [${GameStatus.InProgress}] to [${GameStatus.Completed}]`);

      const docs: FirebaseFirestore.QueryDocumentSnapshot[] = completedGamesSnap.docs.slice(min, max);
      
      requests.push(GameBatchService.handleInProgressToCompletedLoop(docs));
    }

    await Promise.all(requests);
  },
  handleInProgressToCompletedLoop: async (docs: FirebaseFirestore.QueryDocumentSnapshot[]): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {   
      batch.update(doc.ref, {
        initializeProgressUpdateAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: GameStatus.Completed
      });
    });

    await batch.commit();
  },
  handleUpcomingToInProgress: async (upcomingGamesSnap: firebase.firestore.QuerySnapshot): Promise<void> => {
    const { length } = upcomingGamesSnap.docs;

    let loopIndex: number = 1,
      requests: any[] = [];

    for(let i: number = 0; i < length; i += 250) {
      const min: number = i,
        max: number = i + 250,
        adjustedMax: number = Math.min(max, length);

      logger.info(`Loop [${loopIndex++}]: Updating games [${min + 1} - ${adjustedMax}] from [${GameStatus.Upcoming}] to [${GameStatus.InProgress}]`);

      const docs: FirebaseFirestore.QueryDocumentSnapshot[] = upcomingGamesSnap.docs.slice(min, max);

      requests.push(GameBatchService.handleUpcomingToInProgressLoop(docs));
    }

    await Promise.all(requests);
  },
  handleUpcomingToInProgressLoop: async (docs: FirebaseFirestore.QueryDocumentSnapshot[]): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    const getUpdate = (playerCount: number): IGameUpdate => {
      if(playerCount >= 4) {
        return {       
          locked: true, 
          initializeProgressUpdateAt: firebase.firestore.FieldValue.serverTimestamp(),
          status: GameStatus.InProgress 
        }
      }

      return { 
        error: GameError.PlayerMinimumNotMet 
      }
    }

    docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {      
      const game: IGame = doc.data();

      batch.update(doc.ref, getUpdate(game.counts.players));
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