import firebase from "firebase-admin";

import { db } from "../../../firebase";

import { ProfileUtility } from "../../utilities/profileUtility";

import { IGame } from "../../../../stroll-models/game";
import { IProfileUpdate } from "../../../../stroll-models/profileUpdate";

interface IGameBatchService {
  updateCreator: (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate) => Promise<void>;
}

export const GameBatchService: IGameBatchService = {
  updateCreator: async (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate): Promise<void> => {    
    const gameSnap: firebase.firestore.QuerySnapshot = await db.collection("games")
      .where("creator.uid", "==", uid)
      .get();

    gameSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {
      const game: IGame = doc.data();

      batch.update(doc.ref, { creator: ProfileUtility.applyUpdate(game.creator, update) });
    });
  }
}