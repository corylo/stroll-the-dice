import firebase from "firebase/app";

import { IFriend } from "./friend";

export interface IGetFriendsResponse {
  friends: IFriend[];
  offset: firebase.firestore.QueryDocumentSnapshot
}