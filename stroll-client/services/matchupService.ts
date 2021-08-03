import firebase from "firebase/app";

import { db } from "../config/firebase";

import { IMatchup, matchupConverter } from "../../stroll-models/matchup";

import { FirebaseErrorCode } from "../../stroll-enums/firebaseErrorCode";

interface IMatchupServiceGetBy {
  day: (gameID: string, day: number) => Promise<IMatchup[]>;
}

interface IMatchupServiceGet {
  by: IMatchupServiceGetBy;
}

interface IMatchupService {
  get: IMatchupServiceGet;
}

export const MatchupService: IMatchupService = {
  get: {
    by: {
      day: async (gameID: string, day: number): Promise<IMatchup[]> => {
        try {
          const snap: firebase.firestore.QuerySnapshot = await db.collection("games")
            .doc(gameID)
            .collection("matchups")
            .where("day", "==", day)
            .orderBy("createdAt")
            .withConverter(matchupConverter)
            .get();
      
          let matchups: IMatchup[] = [];
      
          snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IMatchup>) => 
            matchups.push(doc.data()));
      
          return matchups;
        } catch (err) {
          if(err.code === FirebaseErrorCode.PermissionDenied) {
            return [];
          }

          throw err;
        }
      }
    }
  }
}