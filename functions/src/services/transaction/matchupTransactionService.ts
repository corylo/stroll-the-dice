import firebase from "firebase-admin";

import { db } from "../../../firebase";

import { IMatchup, matchupConverter } from "../../../../stroll-models/matchup";

interface IMatchupTransactionService {
  updateAll: (transaction: firebase.firestore.Transaction, gameID: string, matchups: IMatchup[]) => void;
}

export const MatchupTransactionService: IMatchupTransactionService = {
  updateAll: (transaction: firebase.firestore.Transaction, gameID: string, matchups: IMatchup[]): void => {    
    matchups.forEach((matchup: IMatchup) => {      
      const matchupRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(gameID)
        .collection("matchups")
        .doc(matchup.id)
        .withConverter(matchupConverter);

      transaction.update(matchupRef, matchup);
    });
  }
}