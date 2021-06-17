
import firebase from "firebase-admin";

import { db } from "../../firebase";

import { ProfileUtility } from "../utilities/profileUtility";

import { IGame } from "../../../stroll-models/game";
import { IProfileUpdate } from "../../../stroll-models/profileUpdate";

interface IGameServiceBatch {
  update: (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate) => Promise<firebase.firestore.WriteBatch>;
}

interface IGameService {
  batch: IGameServiceBatch;
}

export const GameService: IGameService = {
  batch: {
    update: async (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate): Promise<firebase.firestore.WriteBatch> => {    
      const gameSnap: firebase.firestore.QuerySnapshot = await db.collection("games")
        .where("creator.uid", "==", uid)
        .get();

      gameSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {
        const game: IGame = doc.data();

        batch.update(doc.ref, { creator: ProfileUtility.applyUpdate(game.creator, update) });
      });

      return batch;
    }
  }
}