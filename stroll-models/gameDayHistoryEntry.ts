import firebase from "firebase/app";

export interface IGameDayHistoryEntry {
  id: string;
  occurredAt: firebase.firestore.FieldValue;
  quantity: number;
  redeemedBy: string;
}

export const defaultGameDayHistoryEntry = (): IGameDayHistoryEntry => ({      
  id: "",
  occurredAt: firebase.firestore.FieldValue.serverTimestamp(),
  quantity: 0,
  redeemedBy: ""
});

export const gameDayHistoryEntryConverter: any = {
  toFirestore(entry: IGameDayHistoryEntry): firebase.firestore.DocumentData {
    return {
      occurredAt: entry.occurredAt,
      quantity: entry.quantity,
      redeemedBy: entry.redeemedBy
    };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IGameDayHistoryEntry>
  ): IGameDayHistoryEntry {
    const data: IGameDayHistoryEntry = snapshot.data();

    return {      
      id: snapshot.id,
      occurredAt: data.occurredAt,
      quantity: data.quantity,
      redeemedBy: data.redeemedBy
    };
  }
}
