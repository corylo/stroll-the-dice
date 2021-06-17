import firebase from "firebase/app";

import { defaultProfile, IProfile } from "./profile";

interface IInviteRef {
  game: string;
  team: string;
}

export const defaultInviteRef = (): IInviteRef => ({
  game: "",
  team: ""
});

interface IInviteUses {
  current: number;
  max: number;
}

export const defaultInviteUses = (): IInviteUses => ({
  current: 0,
  max: 0
});

export interface IInvite {
  createdAt: firebase.firestore.FieldValue;
  creator: IProfile;  
  duration: number;
  id: string;
  ref: IInviteRef;
  uses: IInviteUses;
}

export const defaultInvite = (): IInvite => ({
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  creator: defaultProfile(),  
  duration: 0,
  id: "",
  ref: defaultInviteRef(),
  uses: defaultInviteUses()
});

export const inviteConverter: firebase.firestore.FirestoreDataConverter<IInvite> = {
  toFirestore(invite: IInvite): firebase.firestore.DocumentData {
    return {
      createdAt: invite.createdAt,
      creator: invite.creator,
      duration: invite.duration,
      ref: invite.ref,
      uses: invite.uses
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IInvite>,
    options: firebase.firestore.SnapshotOptions
  ): IInvite {
    const data: IInvite = snapshot.data(options);

    return {
      createdAt: data.createdAt,
      creator: data.creator,
      duration: data.duration,
      id: snapshot.id,
      ref: data.ref,
      uses: data.uses
    }
  }
}