import firebase from "firebase-admin";

import { IFirestoreTimestamp } from "../../../stroll-models/firestoreTimestamp";

interface IFirestoreDateUtility {
  add: (value: firebase.firestore.FieldValue, seconds: number) => number;
  beginningOfHour: (occurredAt: firebase.firestore.FieldValue) => firebase.firestore.FieldValue;
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
  beginningOfHour: (occurredAt: firebase.firestore.FieldValue): firebase.firestore.FieldValue => {
    const date: Date = FirestoreDateUtility.timestampToDate(occurredAt);

    date.setMinutes(0, 0, 0);

    return FirestoreDateUtility.dateToTimestamp(date);
  },
  dateToTimestamp: (date: Date): firebase.firestore.Timestamp => {
    return firebase.firestore.Timestamp.fromDate(date);
  },
  daysToMillis: (days: number): number => {
    return days * 24 * 3600 * 1000;
  },
  endOfDay: (day: number, startsAt: firebase.firestore.Timestamp): firebase.firestore.Timestamp => {
    const dayAsSeconds: number = FirestoreDateUtility.daysToMillis(day) / 1000,
      seconds: number = FirestoreDateUtility.add(startsAt, dayAsSeconds),
      date: Date = new Date(seconds * 1000);

    return FirestoreDateUtility.dateToTimestamp(date);
  },
  timestampToDate: (value: firebase.firestore.FieldValue): Date => {
    const date: IFirestoreTimestamp = value as any;

    return new Date(date.seconds * 1000);
  }
}