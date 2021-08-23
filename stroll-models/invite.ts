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
  uses: IInviteUses;
}

export const defaultInvite = (): IInvite => ({
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  duration: 0,
  id: "",
  uses: defaultInviteUses()
});

export const inviteConverter: firebase.firestore.FirestoreDataConverter<IInvite> = {
  toFirestore(invite: IInvite): firebase.firestore.DocumentData {
    return {
      createdAt: invite.createdAt,
      duration: invite.duration,
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
      uses: data.uses
    }
  }
}