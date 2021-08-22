import firebase from "firebase-admin";

import { db } from "../../../config/firebase";

import { gameDayHistoryEntryConverter, IGameDayHistoryEntry } from "../../../../stroll-models/gameDayHistoryEntry/gameDayHistoryEntry";

interface IGameDayHistoryTransactionService {
  create: (transaction: firebase.firestore.Transaction, uid: string, entry: IGameDayHistoryEntry) => void;  
}

export const GameDayHistoryTransactionService: IGameDayHistoryTransactionService = {
  create: (transaction: firebase.firestore.Transaction, uid: string, entry: IGameDayHistoryEntry): void => {
    const entryRef: firebase.firestore.DocumentReference = db.collection("profiles")      
      .doc(uid)
      .collection("game_day_history")
      .withConverter(gameDayHistoryEntryConverter)
      .doc();

    transaction.create(entryRef, entry);
  }
}