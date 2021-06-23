import firebase from "firebase/app";

export interface IPredictionUpdate {
  amount: number;
  updatedAt: firebase.firestore.FieldValue; 
}