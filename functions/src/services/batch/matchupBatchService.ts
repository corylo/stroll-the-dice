import firebase from "firebase-admin";

import { db } from "../../../firebase";

import { IMatchup, matchupConverter } from "../../../../stroll-models/matchup";

interface IMatchupBatchService {
  createRemainingMatchups: (gameID: string, matchups: IMatchup[]) => Promise<void>;
  updateAll: (gameID: string, matchups: IMatchup[]) => Promise<void>;
}

export const MatchupBatchService: IMatchupBatchService = {
  createRemainingMatchups: async (gameID: string, matchups: IMatchup[]): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    matchups.forEach((matchup: IMatchup) => {      
      const matchupRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(gameID)
        .collection("matchups")
        .doc()
        .withConverter(matchupConverter);

      batch.set(matchupRef, matchup);
    });

    await batch.commit();
  },
  updateAll: async (gameID: string, matchups: IMatchup[]): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    matchups.forEach((matchup: IMatchup) => {      
      const matchupRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(gameID)
        .collection("matchups")
        .doc(matchup.id)
        .withConverter(matchupConverter);

      batch.update(matchupRef, matchup);
    });

    await batch.commit();
  }
}