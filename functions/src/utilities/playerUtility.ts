import firebase from "firebase-admin";

import { db } from "../../firebase";

import { playerConverter } from "../../../stroll-models/player";

interface IPlayerUtility {
  getPlayersRef: (gameID: string) => firebase.firestore.Query;
}

export const PlayerUtility: IPlayerUtility = {
  getPlayersRef: (gameID: string): firebase.firestore.Query => {
    return  db.collection("games")
      .doc(gameID)
      .collection("players")
      .withConverter(playerConverter);
  }
}