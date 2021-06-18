import firebase from "firebase/app";

import { DateUtility } from "./dateUtility";

interface IFirestoreDateUtility {
  add: (value: firebase.firestore.FieldValue, seconds: number) => number;
  dateToTimestamp: (date: Date) => firebase.firestore.Timestamp;
  inPast: (value: firebase.firestore.FieldValue) => boolean;
  timestampToDateInput: (value: firebase.firestore.FieldValue) => string;
  timestampToLocale: (value: firebase.firestore.FieldValue) => string;
  timestampToRelative: (value: firebase.firestore.FieldValue) => string;
  stringToOffsetTimestamp: (value: string) => firebase.firestore.Timestamp;
  stringToTimestamp: (value: string) => firebase.firestore.Timestamp;
}

export const FirestoreDateUtility: IFirestoreDateUtility = {
  add: (value: firebase.firestore.FieldValue, seconds: number): number => {
    const date: any = value as any;

    return date.seconds + seconds;
  },
  dateToTimestamp: (date: Date): firebase.firestore.Timestamp => {
    return firebase.firestore.Timestamp.fromDate(date);
  },
  inPast: (value: firebase.firestore.FieldValue): boolean => {
    const date: any = value as any;

    return DateUtility.inPast(date.seconds);
  },
  timestampToDateInput: (value: firebase.firestore.FieldValue): string => {
    const date: any = value as any;

    return DateUtility.dateToInput(new Date(date.seconds * 1000));
  },
  timestampToLocale: (value: firebase.firestore.FieldValue): string => {
    const timestamp: any = value as any;
    
    return DateUtility.secondsToLocale(timestamp.seconds);
  },
  timestampToRelative: (value: firebase.firestore.FieldValue): string => {
    const date: any = value as any;

    return DateUtility.secondsToRelative(date.seconds);
  },
  stringToOffsetTimestamp: (value: string): firebase.firestore.Timestamp => {
    const date: Date = new Date(value);
    
    date.setTime(date.getTime() + date.getTimezoneOffset() * 60000);

    return FirestoreDateUtility.dateToTimestamp(date);
  },
  stringToTimestamp: (value: string): firebase.firestore.Timestamp => {
    return FirestoreDateUtility.dateToTimestamp(new Date(value));
  }
}