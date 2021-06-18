import firebase from "firebase/app";

import { defaultProfile, IProfile } from "./profile";

import { GameDuration } from "../stroll-enums/gameDuration";
import { GameMode } from "../stroll-enums/gameMode";

export interface IGameCounts {
  players: number;
  teams: number;
}

const defaultGameCounts = (): IGameCounts => ({
  players: 0,
  teams: 0
});

export interface IGame {
  counts: IGameCounts;
  createdAt: firebase.firestore.FieldValue;
  creator: IProfile;  
  duration: GameDuration;
  id: string;  
  locked: boolean;
  mode: GameMode;
  name: string;
  startsAt: firebase.firestore.FieldValue;
}

export const defaultGame = (): IGame => ({
  counts: defaultGameCounts(),
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  creator: defaultProfile(),  
  duration: GameDuration.None,
  id: "",
  locked: false,
  mode: GameMode.None,
  name: "",
  startsAt: firebase.firestore.FieldValue.serverTimestamp(),
});

export const gameConverter: firebase.firestore.FirestoreDataConverter<IGame> = {
  toFirestore(game: IGame): firebase.firestore.DocumentData {
    return {
      counts: game.counts,
      createdAt: game.createdAt,
      creator: game.creator,
      duration: game.duration,
      locked: game.locked,
      mode: game.mode,
      name: game.name,
      startsAt: game.startsAt
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IGame>,
    options: firebase.firestore.SnapshotOptions
  ): IGame {
    const data: IGame = snapshot.data(options);

    return {
      counts: data.counts,
      createdAt: data.createdAt,
      creator: data.creator,  
      duration: data.duration,    
      id: snapshot.id,
      locked: data.locked,
      mode: data.mode,
      name: data.name,
      startsAt: data.startsAt
    }
  }
}