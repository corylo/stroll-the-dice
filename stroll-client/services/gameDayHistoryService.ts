import firebase from "firebase/app";

import { db } from "../config/firebase";

import { gameDayHistoryEntryConverter, IGameDayHistoryEntry } from "../../stroll-models/gameDayHistoryEntry/gameDayHistoryEntry";
import { IGetGameDayHistoryResponse } from "../../stroll-models/getGameDayHistoryResponse";

interface IGameDayHistoryService {
  get: (uid: string, limit: number, offset: firebase.firestore.QueryDocumentSnapshot) => Promise<IGetGameDayHistoryResponse>;
}

export const GameDayHistoryService: IGameDayHistoryService = {
  get: async (uid: string, limit: number, offset: firebase.firestore.QueryDocumentSnapshot): Promise<IGetGameDayHistoryResponse> => {
    let query: firebase.firestore.Query = db.collection("profiles")
      .doc(uid)
      .collection("game_day_history")
      .orderBy("occurredAt", "desc");

    if(offset !== null) {
      query = query.startAfter(offset);
    }

    const snap: firebase.firestore.QuerySnapshot = await query      
      .limit(limit)      
      .withConverter(gameDayHistoryEntryConverter)
      .get();
      
    let results: IGameDayHistoryEntry[] = [];

    snap.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGameDayHistoryEntry>) =>
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