import firebase from "firebase/app";

import { INotification } from "./notification";

export interface IGetNotificationsResponse {
  notifications: INotification[];
  offset: firebase.firestore.QueryDocumentSnapshot
}