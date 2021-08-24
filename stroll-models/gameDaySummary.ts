import firebase from "firebase/app";

import { IMatchup } from "./matchup";

export interface IGameDaySummaryPlayerReference {
  id: string;
  steps: number;
}

export interface IGameDaySummary {
  day: number;
  id: string;
  matchups: IMatchup[];
  players: IGameDaySummaryPlayerReference[];
}

export const defaultGameDaySummary = (): IGameDaySummary => ({
  day: 0,
  id: "",
  matchups: [],
  players: []
});

export const gameDaySummaryConverter: any = {
  toFirestore(summary: IGameDaySummary): firebase.firestore.DocumentData {
    return {
      day: summary.day,
      matchups: summary.matchups,
      players: summary.players
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot
  ): IGameDaySummary {
    const data: IGameDaySummary = snapshot.data() as IGameDaySummary;

    return {
      day: data.day,
      id: snapshot.id,
      matchups: data.matchups,
      players: data.players
    }
  }
}