import firebase from "firebase/app";

import { db } from "../firebase";

import { gameSummaryConverter, IGameSummary } from "../../stroll-models/gameSummary";

import { FirebaseErrorCode } from "../../stroll-enums/firebaseErrorCode";

interface IGameSummaryService {
  get: (id: string) => Promise<IGameSummary>;
}

export const GameSummaryService: IGameSummaryService = {
  get: async (id: string): Promise<IGameSummary> => {
    try {
      const doc: firebase.firestore.DocumentSnapshot<IGameSummary> = await db.collection("games")
        .doc(id)
        .collection("summary")
        .doc(id)
        .withConverter(gameSummaryConverter)
        .get();

      return doc.exists ? doc.data() : null;
    } catch (err) {
      if(err.code === FirebaseErrorCode.PermissionDenied) {
        return null;
      }

      throw err;
    }
  }
}