import firebase from "firebase/app";

export interface IGameHistoryEntry {
  duration: number;  
  endsAt: firebase.firestore.FieldValue;
  gameID: string;
  id: string;
  name: string;
  place: number;
  points: number;
  steps: number;
}

export const defaultGameHistoryEntry = (): IGameHistoryEntry => ({      
  duration: 0,
  endsAt: null,
  gameID: "",
  id: "",
  name: "",
  place: 0,
  points: 0,  
  steps: 0
});

export const gameHistoryEntryConverter: any = {
  toFirestore(entry: IGameHistoryEntry): firebase.firestore.DocumentData {
    return {
      duration: entry.duration,
      endsAt: entry.endsAt,
      gameID: entry.gameID,
      name: entry.name,
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
      duration: data.duration,
      endsAt: data.endsAt,
      gameID: data.gameID,
      id: snapshot.id,
      name: data.name,
      place: data.place,
      points: data.points,  
      steps: data.steps
    };
  }
}
