import firebase from "firebase/app";

import { GameDuration } from "../stroll-enums/gameDuration";
import { GameError } from "../stroll-enums/gameError";
import { GameMode } from "../stroll-enums/gameMode";
import { GameStatus } from "../stroll-enums/gameStatus";

export interface IGameCounts {
  players: number;
  teams: number;
}

const defaultGameCounts = (): IGameCounts => ({
  players: 0,
  teams: 0
});

export interface IGameSortable {
  name: string;
}

const defaultGameSortable = (): IGameSortable => ({
  name: ""
});

export interface IGame {
  counts: IGameCounts;
  createdAt: firebase.firestore.FieldValue;
  creatorUID: string;  
  duration: GameDuration;
  endsAt: firebase.firestore.FieldValue;
  error: GameError;
  id: string;  
  initializeProgressUpdateAt: firebase.firestore.FieldValue;
  locked: boolean;
  mode: GameMode;
  name: string;
  progressUpdateAt: firebase.firestore.FieldValue;
  sortable: IGameSortable;
  startsAt: firebase.firestore.FieldValue;
  status: GameStatus;
  updatedAt: firebase.firestore.FieldValue;
}

export const defaultGame = (): IGame => ({
  counts: defaultGameCounts(),
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  creatorUID: "",  
  duration: GameDuration.None,
  endsAt: null,
  error: GameError.None,
  id: "",
  initializeProgressUpdateAt: null,
  locked: false,
  mode: GameMode.None,
  name: "",
  progressUpdateAt: null,
  sortable: defaultGameSortable(),
  startsAt: firebase.firestore.FieldValue.serverTimestamp(),
  status: GameStatus.Upcoming,
  updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
});

export const gameConverter: any = {
  toFirestore(game: IGame): firebase.firestore.DocumentData {
    return {
      counts: game.counts,
      createdAt: game.createdAt,
      creatorUID: game.creatorUID,
      duration: game.duration,
      endsAt: game.endsAt,
      error: game.error,
      initializeProgressUpdateAt: game.initializeProgressUpdateAt,
      locked: game.locked,
      mode: game.mode,
      name: game.name,
      progressUpdateAt: game.progressUpdateAt,
      sortable: game.sortable,
      startsAt: game.startsAt,
      status: game.status,
      updatedAt: game.updatedAt
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IGame>
  ): IGame {
    const data: IGame = snapshot.data();

    return {
      counts: data.counts,
      createdAt: data.createdAt,
      creatorUID: data.creatorUID,  
      duration: data.duration,    
      endsAt: data.endsAt,
      error: data.error,
      id: snapshot.id,
      initializeProgressUpdateAt: data.initializeProgressUpdateAt,
      locked: data.locked,
      mode: data.mode,
      name: data.name,
      progressUpdateAt: data.progressUpdateAt,
      sortable: data.sortable,
      startsAt: data.startsAt,
      status: data.status,
      updatedAt: data.updatedAt
    }
  }
}