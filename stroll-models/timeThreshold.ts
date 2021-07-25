import firebase from "firebase/app";

export interface ITimeThreshold {
  quantity: number;
  timestamp: firebase.firestore.FieldValue;
  unit: "H" | "M" | "S";
}