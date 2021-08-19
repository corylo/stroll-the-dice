import firebase from "firebase-admin";

import { db } from "../../../config/firebase";

import { IMatchup, matchupConverter } from "../../../../stroll-models/matchup";

interface IMatchupBatchService {
  createRemainingMatchups: (batch: firebase.firestore.WriteBatch, gameID: string, matchups: IMatchup[]) => void;
}

export const MatchupBatchService: IMatchupBatchService = {
  createRemainingMatchups: (batch: firebase.firestore.WriteBatch, gameID: string, matchups: IMatchup[]): void => {    
    matchups.forEach((matchup: IMatchup) => {      
      const matchupRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(gameID)
        .collection("matchups")
        .doc(matchup.id)
        .withConverter(matchupConverter);

      batch.set(matchupRef, matchup);
    });
  }
}