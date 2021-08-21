import firebase from "firebase/app";

import { IGame } from "./game";

export interface IGetGamesResponse {
  games: IGame[];
  offset: firebase.firestore.QueryDocumentSnapshot
}