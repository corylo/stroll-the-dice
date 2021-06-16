import firebase from "firebase/app";

import { defaultProfile, IProfile } from "./profile";

import { GameDuration } from "../stroll-enums/gameDuration";
import { GameMode } from "../stroll-enums/gameMode";

export interface IGame {
  createdAt: firebase.firestore.FieldValue;
  creator: IProfile;  
  duration: GameDuration;
  id: string;  
  mode: GameMode;
  name: string;
}

export const defaultGame = (): IGame => ({
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  creator: defaultProfile(),  
  duration: GameDuration.None,
  id: "",
  mode: GameMode.None,
  name: ""
});

export const gameConverter: firebase.firestore.FirestoreDataConverter<IGame> = {
  toFirestore(game: IGame): firebase.firestore.DocumentData {
    return {
      createdAt: game.createdAt,
      creator: game.creator,
      duration: game.duration,
      mode: game.mode,
      name: game.name
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IGame>,
    options: firebase.firestore.SnapshotOptions
  ): IGame {
    const data: IGame = snapshot.data(options);

    return {
      createdAt: data.createdAt,
      creator: data.creator,  
      duration: data.duration,    
      id: snapshot.id,
      mode: data.mode,
      name: data.name
    }
  }
}