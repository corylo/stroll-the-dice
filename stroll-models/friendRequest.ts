import firebase from "firebase/app";

import { IProfileReference } from "./profileReference";

import { FriendRequestType } from "../stroll-enums/friendRequestType";

export interface IFriendRequest {
  acceptedAt: firebase.firestore.FieldValue;
  createdAt: firebase.firestore.FieldValue;  
  profile?: IProfileReference;
  type: FriendRequestType;
  uid: string;
}

export const defaultFriendRequest = (): IFriendRequest => ({
  acceptedAt: firebase.firestore.FieldValue.serverTimestamp(),
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),  
  type: FriendRequestType.Incoming,
  uid: ""
});

export const friendRequestConverter: any = {
  toFirestore(request: IFriendRequest): firebase.firestore.DocumentData {
    return {
      acceptedAt: request.acceptedAt,
      createdAt: request.createdAt,
      type: request.type
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IFriendRequest>
  ): IFriendRequest {
    const data: IFriendRequest = snapshot.data();

    return {
      acceptedAt: data.acceptedAt,
      createdAt: data.createdAt,
      type: data.type,
      uid: snapshot.id
    }
  }
}