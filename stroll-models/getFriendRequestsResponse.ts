import firebase from "firebase/app";

import { IFriendRequest } from "./friendRequest";

export interface IGetFriendRequestsResponse {
  requests: IFriendRequest[];
  offset: firebase.firestore.QueryDocumentSnapshot
}