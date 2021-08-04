import firebase from "firebase/app";

import { defaultProfileReference, IProfileReference } from "./profileReference";

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
  index: number;
  points: IPlayerPoints;
  profile: IProfileReference;
  ref: IPlayerRef;  
  updatedAt: firebase.firestore.FieldValue; 
}

export const defaultPlayer = (): IPlayer => ({
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  id: "",  
  index: 0,
  points: defaultPlayerPoints(),
  profile: defaultProfileReference(),
  ref: defaultPlayerRef(),  
  updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
});

export const playerConverter: any = {
  toFirestore(player: IPlayer): firebase.firestore.DocumentData {
    return {
      createdAt: player.createdAt,      
      index: player.index,
      points: player.points,
      profile: player.profile,
      ref: player.ref,
      updatedAt: player.updatedAt
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IPlayer>
  ): IPlayer {
    const data: IPlayer = snapshot.data();

    return {
      createdAt: data.createdAt,   
      index: data.index,   
      points: data.points,
      profile: data.profile,
      id: snapshot.id,
      ref: data.ref,
      updatedAt: data.updatedAt
    }
  }
}