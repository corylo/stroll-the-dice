import firebase from "firebase/app";

import { IPlayer } from "./player";

export interface IGameSummary {
  players: IPlayer[];
}

export const defaultGameSummary = (): IGameSummary => ({
  players: []
});

export const gameSummaryConverter: firebase.firestore.FirestoreDataConverter<IGameSummary> = {
  toFirestore(summary: IGameSummary): firebase.firestore.DocumentData {
    return {
      players: summary.players
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IGameSummary>,
    options: firebase.firestore.SnapshotOptions
  ): IGameSummary {
    const data: IGameSummary = snapshot.data(options);

    return {
      players: data.players
    }
  }
}