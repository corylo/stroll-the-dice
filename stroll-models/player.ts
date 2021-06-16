import firebase from "firebase/app";

import { defaultProfile, IProfile } from "./profile";

export interface IPlayerRef {
  game: string;
  invite: string;
}

export const defaultPlayerRef = (): IPlayerRef => ({
  game: "",
  invite: ""
});

export interface IPlayer {
  createdAt: firebase.firestore.FieldValue;  
  id: string;  
  profile: IProfile;
  ref: IPlayerRef;
  team: string;
}

export const defaultPlayer = (): IPlayer => ({
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  id: "",  
  profile: defaultProfile(),
  ref: defaultPlayerRef(),
  team: ""
});

export const playerConverter: firebase.firestore.FirestoreDataConverter<IPlayer> = {
  toFirestore(player: IPlayer): firebase.firestore.DocumentData {
    return {
      createdAt: player.createdAt,      
      profile: player.profile,
      ref: player.ref,
      team: player.team
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IPlayer>,
    options: firebase.firestore.SnapshotOptions
  ): IPlayer {
    const data: IPlayer = snapshot.data(options);

    return {
      createdAt: data.createdAt,      
      profile: data.profile,
      id: snapshot.id,
      ref: data.ref,
      team: data.team
    }
  }
}