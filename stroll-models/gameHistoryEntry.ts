import firebase from "firebase/app";

export interface IGameHistoryEntry {
  endsAt: firebase.firestore.FieldValue;
  gameID: string;
  id: string;
  place: number;
  points: number;
  steps: number;
}

export const defaultGameHistoryEntry = (): IGameHistoryEntry => ({      
  endsAt: null,
  gameID: "",
  id: "",
  place: 0,
  points: 0,  
  steps: 0
});

export const gameHistoryEntryConverter: any = {
  toFirestore(entry: IGameHistoryEntry): firebase.firestore.DocumentData {
    return {
      endsAt: entry.endsAt,
      gameID: entry.gameID,
      place: entry.place,
      points: entry.points,  
      steps: entry.steps
    };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IGameHistoryEntry>
  ): any {
    const data: IGameHistoryEntry = snapshot.data();

    return {
      endsAt: data.endsAt,
      gameID: data.gameID,
      id: snapshot.id,
      place: data.place,
      points: data.points,  
      steps: data.steps
    };
  }
}
