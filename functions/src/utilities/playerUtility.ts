import firebase from "firebase-admin";

import { db } from "../../firebase";

import { IPlayer, playerConverter } from "../../../stroll-models/player";

interface IPlayerUtility {
  getPlayersRef: (gameID: string) => firebase.firestore.Query;
  hasProfileChanged: (before: IPlayer, after: IPlayer) => boolean;
}

export const PlayerUtility: IPlayerUtility = {
  getPlayersRef: (gameID: string): firebase.firestore.Query => {
    return  db.collection("games")
      .doc(gameID)
      .collection("players")
      .withConverter(playerConverter);
  },
  hasProfileChanged: (before: IPlayer, after: IPlayer): boolean => {
    return (
      before.profile.color !== after.profile.color ||
      before.profile.icon !== after.profile.icon ||
      before.profile.name !== after.profile.name ||
      before.profile.username !== after.profile.username
    )
  }
}