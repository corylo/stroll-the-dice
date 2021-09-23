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
  refundedAt?: firebase.firestore.FieldValue;
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
    const result: any = {
      amount: prediction.amount,
      createdAt: prediction.createdAt,
      ref: prediction.ref,
      updatedAt: prediction.updatedAt
    }

    if(prediction.refundedAt) {
      result.refundedAt = prediction.refundedAt;
    }

    return result;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot
  ): IPrediction {
    const data: IPrediction = snapshot.data() as IPrediction;

    const result: IPrediction = {
      amount: data.amount,
      createdAt: data.createdAt,
      id: snapshot.id,
      ref: data.ref,
      updatedAt: data.updatedAt
    }

    if(data.refundedAt) {
      result.refundedAt = data.refundedAt;
    }

    return result;
  }
}