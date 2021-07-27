import firebase from "firebase/app";

export interface IGamePassRef {
  creator: string;
  redeemer: string;
}

export const defaultGamePassRef = (): IGamePassRef => ({
  creator: "",
  redeemer: ""
});

export interface IGamePass {
  code: string;
  createdAt: firebase.firestore.FieldValue;
  redeemedAt: firebase.firestore.FieldValue;
  ref: IGamePassRef;
}

export const defaultGamePass = (): IGamePass => ({
  code: "",
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  redeemedAt: firebase.firestore.FieldValue.serverTimestamp(),
  ref: defaultGamePassRef()
});

export const gamePassConverter: any = {
  toFirestore(pass: IGamePass): firebase.firestore.DocumentData {
    return {
      code: pass.code,
      createdAt: pass.createdAt,
      redeemedAt: pass.redeemedAt,
      ref: pass.ref
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IGamePass>
  ): IGamePass {
    const data: IGamePass = snapshot.data();

    return {
      code: data.code,
      createdAt: data.createdAt,
      redeemedAt: data.redeemedAt,
      ref: data.ref
    }
  }
}