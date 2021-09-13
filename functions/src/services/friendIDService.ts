import firebase from "firebase-admin";

import { db } from "../../config/firebase";

import { friendIDReferenceConverter, IFriendIDReference } from "../../../stroll-models/friendIDReference";

interface IFriendIDService {
  deleteByUID: (uid: string) => Promise<void>;
  getUIDByFriendID: (friendID: string) => Promise<string>;
}

export const FriendIDService: IFriendIDService = {
  deleteByUID: async (uid: string): Promise<void> => {
    const snap: firebase.firestore.QuerySnapshot = await db.collection("friend_ids")
      .where("uid", "==", uid)
      .withConverter(friendIDReferenceConverter)
      .get();
      
    snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IFriendIDReference>) => 
      doc.ref.delete());
  },
  getUIDByFriendID: async (friendID: string): Promise<string> => {
    const doc: firebase.firestore.DocumentSnapshot<IFriendIDReference> = await db.collection("friend_ids")
      .doc(friendID)
      .withConverter<IFriendIDReference>(friendIDReferenceConverter)
      .get();
    
    if(doc.exists) {
      const ref: IFriendIDReference = doc.data();

      return ref.uid;
    }

    throw new Error(`Reference to friend ID [${friendID}] does not exist.`);
  }
}