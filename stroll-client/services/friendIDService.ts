import firebase from "firebase/app";

import { db } from "../config/firebase";

import { friendIDReferenceConverter, IFriendIDReference } from "../../stroll-models/friendIDReference";

interface IFriendIDService {
  getUIDByFriendID: (friendID: string) => Promise<string>;
}

export const FriendIDService: IFriendIDService = {
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