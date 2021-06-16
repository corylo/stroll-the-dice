import firebase from "firebase/app";

import { defaultProfile, IProfile } from "./profile";

export interface IPlayer {
  createdAt: firebase.firestore.FieldValue;  
  id: string;
  inviteID: string;
  profile: IProfile;
  team: string;
}

export const defaultPlayer = (): IPlayer => ({
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  id: "",
  inviteID: "",
  profile: defaultProfile(),
  team: ""
});

export const playerConverter: firebase.firestore.FirestoreDataConverter<IPlayer> = {
  toFirestore(player: IPlayer): firebase.firestore.DocumentData {
    return {
      createdAt: player.createdAt,
      inviteID: player.inviteID,
      profile: player.profile,
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
      inviteID: data.inviteID,
      profile: data.profile,
      id: snapshot.id,
      team: data.team
    }
  }
}