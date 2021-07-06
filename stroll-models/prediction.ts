import firebase from "firebase/app";

export interface IPredictionRef {
  creator: string;
  game: string;
  matchup: string,
  player: string;
}

export const defaultPredictionRef = (): IPredictionRef => ({
  creator: "",
  game: "",
  matchup: "",
  player: ""
});

export interface IPrediction {
  amount: number;
  createdAt: firebase.firestore.FieldValue; 
  id: string;
  ref: IPredictionRef;
  updatedAt: firebase.firestore.FieldValue; 
}

export const defaultPrediction = (): IPrediction => ({
  amount: 0,
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  id: "",
  ref: defaultPredictionRef(),
  updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
});

export const predictionConverter: any = {
  toFirestore(prediction: IPrediction): firebase.firestore.DocumentData {
    return {
      amount: prediction.amount,
      createdAt: prediction.createdAt,
      ref: prediction.ref,
      updatedAt: prediction.updatedAt
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot
  ): IPrediction {
    const data: IPrediction = snapshot.data() as IPrediction;

    return {
      amount: data.amount,
      createdAt: data.createdAt,
      id: snapshot.id,
      ref: data.ref,
      updatedAt: data.updatedAt
    }
  }
}