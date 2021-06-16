
import firebase from "firebase-admin";

import { db } from "../../firebase";

import { IGame } from "../../../stroll-models/game";
import { IProfile } from "../../../stroll-models/profile";
import { IProfileUpdate } from "../../../stroll-models/profileUpdate";

interface IGameService {
  batchUpdate: (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate) => Promise<firebase.firestore.WriteBatch>;
}

export const GameService: IGameService = {
  batchUpdate: async (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate): Promise<firebase.firestore.WriteBatch> => {    
    const snap: firebase.firestore.QuerySnapshot = await db.collection("games")
    .where("creator.uid", "==", uid)
    .get();

    snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {
      const game: IGame = doc.data();

      const creator: IProfile = {
        ...game.creator,
        color: update.color,
        icon: update.icon,
        username: update.username
      }

      batch.update(doc.ref, { creator });
    });

    return batch;
  }
}