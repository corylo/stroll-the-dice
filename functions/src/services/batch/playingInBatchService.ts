import firebase from "firebase-admin";

import { db } from "../../../config/firebase";

import { IGame } from "../../../../stroll-models/game";

interface IPlayingInBatchService {
  deleteAll: (gameID: string) => Promise<void>;
  update: (batch: firebase.firestore.WriteBatch, gameID: string, after: IGame) => Promise<firebase.firestore.WriteBatch>;
}

export const PlayingInBatchService: IPlayingInBatchService = {  
  deleteAll: async (gameID: string): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    const playingInSnap: firebase.firestore.QuerySnapshot = await db.collectionGroup("playing_in")
      .where("id", "==", gameID)
      .get();

    playingInSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => 
      batch.delete(doc.ref));

    await batch.commit();
  },
  update: async (batch: firebase.firestore.WriteBatch, gameID: string, after: IGame): Promise<firebase.firestore.WriteBatch> => {    
    const playingInSnap: firebase.firestore.QuerySnapshot = await db.collectionGroup("playing_in")
      .where("id", "==", gameID)
      .get();

    playingInSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => {        
      batch.update(doc.ref, { 
        name: after.name.toLowerCase(), 
        startsAt: after.startsAt,
        status: after.status,
        endsAt: after.endsAt
      });
    });

    return batch;
  }
}