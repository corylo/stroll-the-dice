import firebase from "firebase/app";

import { IProfileReference } from "./profileReference";

export interface IFriend {
  createdAt: firebase.firestore.FieldValue;
  profile?: IProfileReference;
  uid: string;
}

export const defaultFriend = (): IFriend => ({
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  uid: ""
});

export const friendConverter: any = {
  toFirestore(friend: IFriend): firebase.firestore.DocumentData {
    return {
      createdAt: friend.createdAt
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IFriend>
  ): IFriend {
    const data: IFriend = snapshot.data();

    return {
      createdAt: data.createdAt,
      uid: snapshot.id
    }
  }
}