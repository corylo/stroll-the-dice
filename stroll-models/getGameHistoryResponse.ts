import firebase from "firebase/app";

import { IGameHistoryEntry } from "./gameHistoryEntry";

export interface IGetGameHistoryResponse {
  entries: IGameHistoryEntry[];
  offset: firebase.firestore.QueryDocumentSnapshot
}