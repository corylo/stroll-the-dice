import firebase from "firebase-admin";

import { db } from "../../../firebase";

import { ProfileUtility } from "../../utilities/profileUtility";

import { IInvite } from "../../../../stroll-models/invite";
import { IProfileUpdate } from "../../../../stroll-models/profileUpdate";

interface IInviteBatchService {
  updateCreator: (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate) => Promise<firebase.firestore.WriteBatch>;
}

export const InviteBatchService: IInviteBatchService = {
  updateCreator: async (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate): Promise<firebase.firestore.WriteBatch> => {    
    const inviteSnap: firebase.firestore.QuerySnapshot = await db.collectionGroup("invites")
      .where("creator.uid", "==", uid)
      .get();

    inviteSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IInvite>) => {
      const invite: IInvite = doc.data();

      batch.update(doc.ref, { creator: ProfileUtility.applyUpdate(invite.creator, update) });
    });

    return batch;
  }
}