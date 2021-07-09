import firebase from "firebase/app";

import { defaultProfile, IProfile } from "./profile";

import { GameDuration } from "../stroll-enums/gameDuration";
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
  creator: IProfile;  
  duration: GameDuration;
  endsAt: firebase.firestore.FieldValue;
  id: string;  
  locked: boolean;
  mode: GameMode;
  name: string;
  progressUpdateAt: firebase.firestore.FieldValue;
  sortable: IGameSortable;
  startsAt: firebase.firestore.FieldValue;
  status: GameStatus;
}

export const defaultGame = (): IGame => ({
  counts: defaultGameCounts(),
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  creator: defaultProfile(),  
  duration: GameDuration.None,
  endsAt: null,
  id: "",
  locked: false,
  mode: GameMode.None,
  name: "",
  progressUpdateAt: null,
  sortable: defaultGameSortable(),
  startsAt: firebase.firestore.FieldValue.serverTimestamp(),
  status: GameStatus.Upcoming
});

export const gameConverter: any = {
  toFirestore(game: IGame): firebase.firestore.DocumentData {
    return {
      counts: game.counts,
      createdAt: game.createdAt,
      creator: game.creator,
      duration: game.duration,
      endsAt: game.endsAt,
      locked: game.locked,
      mode: game.mode,
      name: game.name,
      progressUpdateAt: game.progressUpdateAt,
      sortable: game.sortable,
      startsAt: game.startsAt,
      status: game.status
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IGame>
  ): IGame {
    const data: IGame = snapshot.data();

    return {
      counts: data.counts,
      createdAt: data.createdAt,
      creator: data.creator,  
      duration: data.duration,    
      endsAt: data.endsAt,
      id: snapshot.id,
      locked: data.locked,
      mode: data.mode,
      name: data.name,
      progressUpdateAt: data.progressUpdateAt,
      sortable: data.sortable,
      startsAt: data.startsAt,
      status: data.status
    }
  }
}