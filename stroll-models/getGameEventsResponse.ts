import firebase from "firebase/app";

import { IGameEvent } from "./gameEvent/gameEvent";

export interface IGetGameEventsResponse {
  events: IGameEvent[];
  offset: firebase.firestore.QueryDocumentSnapshot
}