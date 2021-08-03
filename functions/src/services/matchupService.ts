import firebase from "firebase-admin";

import { db } from "../../config/firebase";

import { IMatchup, matchupConverter } from "../../../stroll-models/matchup";

interface IMatchupService {
  getByGameAndDay: (id: string, day: number) => Promise<IMatchup[]>;
}

export const MatchupService: IMatchupService = {
  getByGameAndDay: async (id: string, day: number): Promise<IMatchup[]> => {    
    const snap: firebase.firestore.QuerySnapshot = await db.collection("games")
      .doc(id)
      .collection("matchups")
      .where("day", "==", day)
      .orderBy("createdAt")
      .withConverter(matchupConverter)
      .get();

    let matchups: IMatchup[] = [];

    snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IMatchup>) => 
      matchups.push(doc.data()));
    
    return matchups;
  }
}