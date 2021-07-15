import firebase from "firebase-admin";

import { IFirestoreTimestamp } from "../../../stroll-models/firestoreTimestamp";

interface IFirestoreDateUtility {
  add: (value: firebase.firestore.FieldValue, seconds: number) => number;
  dateToTimestamp: (date: Date) => firebase.firestore.Timestamp;
  daysToMillis: (days: number) => number;  
  endOfDay: (day: number, startsAt: firebase.firestore.FieldValue) => firebase.firestore.FieldValue;
  timestampToDate: (value: firebase.firestore.FieldValue) => Date;
}

export const FirestoreDateUtility: IFirestoreDateUtility = {
  add: (value: firebase.firestore.FieldValue, seconds: number): number => {
    const date: IFirestoreTimestamp = value as any;
    
    return date.seconds + seconds;
  },
  dateToTimestamp: (date: Date): firebase.firestore.Timestamp => {
    return firebase.firestore.Timestamp.fromDate(date);
  },
  daysToMillis: (days: number): number => {
    return days * 24 * 3600 * 1000;
  },
  endOfDay: (day: number, startsAt: firebase.firestore.Timestamp): firebase.firestore.Timestamp => {
    return FirestoreDateUtility.dateToTimestamp(new Date(FirestoreDateUtility.add(startsAt, FirestoreDateUtility.daysToMillis(day) / 1000)))
  },
  timestampToDate: (value: firebase.firestore.FieldValue): Date => {
    const date: IFirestoreTimestamp = value as any;

    return new Date(date.seconds * 1000);
  }
}