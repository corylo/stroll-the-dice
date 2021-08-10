import firebase from "firebase/app";

import { GameDayHistoryEntryType } from "../stroll-enums/gameDayHistoryEntryType";

export interface IGameDayHistoryEntry {
  gameID: string;
  id: string;
  occurredAt: firebase.firestore.FieldValue;
  quantity: number;
  redeemedBy: string;
  type: GameDayHistoryEntryType
}

export const defaultGameDayHistoryEntry = (): IGameDayHistoryEntry => ({      
  gameID: "",
  id: "",
  occurredAt: firebase.firestore.FieldValue.serverTimestamp(),
  quantity: 0,
  redeemedBy: "",
  type: GameDayHistoryEntryType.None
});

export const gameDayHistoryEntryConverter: any = {
  toFirestore(entry: IGameDayHistoryEntry): firebase.firestore.DocumentData {
    return {
      gameID: entry.gameID,
      occurredAt: entry.occurredAt,
      quantity: entry.quantity,
      redeemedBy: entry.redeemedBy,
      type: entry.type
    };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IGameDayHistoryEntry>
  ): IGameDayHistoryEntry {
    const data: IGameDayHistoryEntry = snapshot.data();

    return {      
      gameID: data.gameID,
      id: snapshot.id,
      occurredAt: data.occurredAt,
      quantity: data.quantity,
      redeemedBy: data.redeemedBy,
      type: data.type
    };
  }
}
