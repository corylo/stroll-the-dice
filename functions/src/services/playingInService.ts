import firebase from "firebase-admin";

import { db } from "../../firebase";

interface IPlayingInServiceBatch {
  update: (batch: firebase.firestore.WriteBatch, gameID: string, startsAt: firebase.firestore.FieldValue) => Promise<firebase.firestore.WriteBatch>;
}

interface IPlayingInService {
  batch: IPlayingInServiceBatch;
}

export const PlayingInService: IPlayingInService = {
  batch: {
    update: async (batch: firebase.firestore.WriteBatch, gameID: string, startsAt: firebase.firestore.FieldValue): Promise<firebase.firestore.WriteBatch> => {    
      const playingInSnap: firebase.firestore.QuerySnapshot = await db.collectionGroup("playing_in")
        .where("id", "==", gameID)
        .get();

      playingInSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => {        
        batch.update(doc.ref, { startsAt });
      });

      return batch;
    }
  }
}