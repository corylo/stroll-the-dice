import firebase from "firebase/app";

import { GameDayHistoryUtility } from "../../stroll-utilities/gameDayHistoryUtility";

import { GameDayHistoryEntryType } from "../../stroll-enums/gameDayHistoryEntryType";

export interface IGameDayHistoryEntry {
  id: string;
  occurredAt: firebase.firestore.FieldValue;
  quantity: number;
  type: GameDayHistoryEntryType;
}

export const defaultGameDayHistoryEntry = (): IGameDayHistoryEntry => ({        
  id: "",
  occurredAt: firebase.firestore.FieldValue.serverTimestamp(),  
  quantity: 0,    
  type: GameDayHistoryEntryType.None
});

export const gameDayHistoryEntryConverter: any = {
  toFirestore(entry: IGameDayHistoryEntry): firebase.firestore.DocumentData {
    return GameDayHistoryUtility.mapToFirestore(entry);
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IGameDayHistoryEntry>
  ): any {
    return GameDayHistoryUtility.mapFromFirestore(snapshot.id, snapshot.data());
  }
}
