import firebase from "firebase-admin";

import { db } from "../../../config/firebase";

import { defaultMatchupSideTotal, IMatchup, matchupConverter } from "../../../../stroll-models/matchup";

interface IMatchupTransactionService {
  resetOneSidedMatchups: (transaction: firebase.firestore.Transaction, gameID: string, matchups: IMatchup[]) => void;
}

export const MatchupTransactionService: IMatchupTransactionService = {
  resetOneSidedMatchups: (transaction: firebase.firestore.Transaction, gameID: string, matchups: IMatchup[]): void => {
    matchups.forEach((matchup: IMatchup) => {
      const matchupRef: firebase.firestore.DocumentReference<IMatchup> = db.collection("games")
        .doc(gameID)
        .collection("matchups")
        .doc(matchup.id)
        .withConverter<IMatchup>(matchupConverter)

      transaction.update(matchupRef, {
        ["left.total"]: defaultMatchupSideTotal(),
        ["right.total"]: defaultMatchupSideTotal()
      });
    })
  }
}