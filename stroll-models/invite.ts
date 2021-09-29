import firebase from "firebase/app";

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
  duration: number;
  id: string;
  lastUsedAt: firebase.firestore.FieldValue;
  uses: IInviteUses;
}

export const defaultInvite = (): IInvite => ({
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  duration: 0,
  id: "",
  lastUsedAt: null,
  uses: defaultInviteUses()
});

export const inviteConverter: firebase.firestore.FirestoreDataConverter<IInvite> = {
  toFirestore(invite: IInvite): firebase.firestore.DocumentData {
    return {
      createdAt: invite.createdAt,
      duration: invite.duration,
      lastUsedAt: invite.lastUsedAt,
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
      duration: data.duration,
      id: snapshot.id,
      lastUsedAt: data.lastUsedAt,
      uses: data.uses
    }
  }
}