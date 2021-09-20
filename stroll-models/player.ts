import firebase from "firebase/app";

import { defaultProfile, IProfile } from "./profile";

import { GameStatus } from "../stroll-enums/gameStatus";

export interface IPlayerPoints {
  available: number;
  total: number;
}

export const defaultPlayerPoints = (): IPlayerPoints => ({
  available: 0,
  total: 0
});

export interface IPlayerRef {
  acceptedGiftDays: boolean;
  game: string;
  gameStatus: GameStatus;
  invite: string
  lastMatchupPredicted: string;
  team: string;
}

export const defaultPlayerRef = (): IPlayerRef => ({
  acceptedGiftDays: false,
  game: "",
  gameStatus: GameStatus.Upcoming,
  invite: "",
  lastMatchupPredicted: "",
  team: ""
});

export interface IPlayer {
  createdAt: firebase.firestore.FieldValue;  
  id: string;  
  index?: number;
  place: number;
  points: IPlayerPoints;
  profile?: IProfile;
  ref: IPlayerRef;  
  steps: number;
  updatedAt: firebase.firestore.FieldValue; 
}

export const defaultPlayer = (): IPlayer => ({
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  id: "",  
  place: 0,
  points: defaultPlayerPoints(),
  profile: defaultProfile(),
  ref: defaultPlayerRef(),  
  steps: 0,
  updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
});

export const playerConverter: any = {
  toFirestore(player: IPlayer): firebase.firestore.DocumentData {
    return {
      createdAt: player.createdAt,  
      place: player.place,
      points: player.points,
      ref: player.ref,
      steps: player.steps,
      updatedAt: player.updatedAt
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IPlayer>
  ): IPlayer {
    const data: IPlayer = snapshot.data();

    return {
      createdAt: data.createdAt,   
      place: data.place,
      points: data.points,
      id: snapshot.id,
      ref: data.ref,
      steps: data.steps,
      updatedAt: data.updatedAt
    }
  }
}