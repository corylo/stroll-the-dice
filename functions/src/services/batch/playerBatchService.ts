import firebase from "firebase-admin";

import { db } from "../../../firebase";

import { ProfileUtility } from "../../utilities/profileUtility";

import { IPlayer } from "../../../../stroll-models/player";
import { IProfileUpdate } from "../../../../stroll-models/profileUpdate";

interface IPlayerBatchService {
  updateProfile: (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate) => Promise<void>;
}

export const PlayerBatchService: IPlayerBatchService = {
  updateProfile: async (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate): Promise<void> => {    
    const playerSnap: firebase.firestore.QuerySnapshot = await db.collectionGroup("players")
        .where("profile.uid", "==", uid)
        .get();

    playerSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IPlayer>) => {
      const player: IPlayer = doc.data();

      batch.update(doc.ref, { profile: ProfileUtility.applyUpdate(player.profile, update) });
    });
  }
}