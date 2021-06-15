import firebase from "firebase/app";

import { defaultProfile, IProfile } from "./profile";

export interface IGame {
  createdAt: firebase.firestore.FieldValue;
  creator: IProfile;  
  id: string;  
  name: string;
}

export const defaultGame = (): IGame => ({
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  creator: defaultProfile(),  
  id: "",
  name: ""
});

export const gameConverter: firebase.firestore.FirestoreDataConverter<IGame> = {
  toFirestore(game: IGame): firebase.firestore.DocumentData {
    return {
      createdAt: game.createdAt,
      creator: game.creator,
      name: game.name
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): IGame {
    const data: IGame = snapshot.data(options) as IGame;

    return {
      createdAt: data.createdAt,
      creator: data.creator,      
      id: snapshot.id,
      name: data.name
    }
  }
}