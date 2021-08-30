import firebase from "firebase/app";

import { db } from "../config/firebase";

import { gameHistoryEntryConverter, IGameHistoryEntry } from "../../stroll-models/gameHistoryEntry";
import { IGetGameHistoryResponse } from "../../stroll-models/getGameHistoryResponse";

interface IGameHistoryService {
  get: (uid: string, limit: number, offset: firebase.firestore.QueryDocumentSnapshot) => Promise<IGetGameHistoryResponse>;
}

export const GameHistoryService: IGameHistoryService = {
  get: async (uid: string, limit: number, offset: firebase.firestore.QueryDocumentSnapshot): Promise<IGetGameHistoryResponse> => {
    let query: firebase.firestore.Query = db.collection("profiles")
      .doc(uid)
      .collection("game_history")
      .orderBy("endsAt", "desc");

    if(offset !== null) {
      query = query.startAfter(offset);
    }

    const snap: firebase.firestore.QuerySnapshot = await query      
      .limit(limit)      
      .withConverter(gameHistoryEntryConverter)
      .get();
      
    let results: IGameHistoryEntry[] = [];

    snap.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGameHistoryEntry>) =>
      results.push(doc.data()));

    const newOffset: firebase.firestore.QueryDocumentSnapshot = snap.size > 0 
      ? snap.docs[snap.size - 1] 
      : null;

    return {
      entries: results,
      offset: newOffset
    };
  }
}