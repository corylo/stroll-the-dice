import firebase from "firebase/app";

import { defaultProfile, IProfile } from "./profile";

export interface IPlayerRef {
  game: string;
  invite: string;
  team: string;
}

export const defaultPlayerRef = (): IPlayerRef => ({
  game: "",
  invite: "",
  team: ""
});

export interface IPlayer {
  createdAt: firebase.firestore.FieldValue;  
  id: string;  
  index: number;
  profile: IProfile;
  ref: IPlayerRef;  
}

export const defaultPlayer = (): IPlayer => ({
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  id: "",  
  index: 0,
  profile: defaultProfile(),
  ref: defaultPlayerRef(),  
});

export const playerConverter: firebase.firestore.FirestoreDataConverter<IPlayer> = {
  toFirestore(player: IPlayer): firebase.firestore.DocumentData {
    return {
      createdAt: player.createdAt,      
      index: player.index,
      profile: player.profile,
      ref: player.ref
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IPlayer>,
    options: firebase.firestore.SnapshotOptions
  ): IPlayer {
    const data: IPlayer = snapshot.data(options);

    return {
      createdAt: data.createdAt,      
      index: data.index,
      profile: data.profile,
      id: snapshot.id,
      ref: data.ref
    }
  }
}