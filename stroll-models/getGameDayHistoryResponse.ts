import firebase from "firebase/app";

import { IGameDayHistoryEntry } from "./gameDayHistoryEntry/gameDayHistoryEntry";

export interface IGetGameDayHistoryResponse {
  entries: IGameDayHistoryEntry[];
  offset: firebase.firestore.QueryDocumentSnapshot
}