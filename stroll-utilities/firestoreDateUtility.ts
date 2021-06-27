import firebase from "firebase/app";

import { DateUtility } from "./dateUtility";

import { IFirestoreTimestamp } from "../stroll-models/firestoreTimestamp";

interface IFirestoreDateUtility {
  add: (value: firebase.firestore.FieldValue, seconds: number) => number;
  dateToTimestamp: (date: Date) => firebase.firestore.Timestamp;
  diffInDays: (value: firebase.firestore.FieldValue) => number;  
  lessThanOrEqualToNow: (value: firebase.firestore.FieldValue) => boolean;
  on24HourIncrement: (value: firebase.firestore.FieldValue) => boolean;
  timestampToDate: (value: firebase.firestore.FieldValue) => Date;
  timestampToDateInput: (value: firebase.firestore.FieldValue) => string;
  timestampToLocale: (value: firebase.firestore.FieldValue) => string;
  timestampToRelative: (value: firebase.firestore.FieldValue) => string;
  stringToOffsetTimestamp: (value: string) => firebase.firestore.Timestamp;
  stringToTimestamp: (value: string) => firebase.firestore.Timestamp;
}

export const FirestoreDateUtility: IFirestoreDateUtility = {
  add: (value: firebase.firestore.FieldValue, seconds: number): number => {
    const date: IFirestoreTimestamp = value as any;
    
    return date.seconds + seconds;
  },
  dateToTimestamp: (date: Date): firebase.firestore.Timestamp => {
    return firebase.firestore.Timestamp.fromDate(date);
  },
  diffInDays: (value: firebase.firestore.FieldValue): number => {
    return DateUtility.diffInDays(FirestoreDateUtility.timestampToDateInput(value));
  },
  lessThanOrEqualToNow: (value: firebase.firestore.FieldValue): boolean => {
    const date: IFirestoreTimestamp = value as any;

    return DateUtility.lessThanOrEqualToNow(date.seconds);
  },
  on24HourIncrement: (value: firebase.firestore.FieldValue): boolean => {
    const date: Date = FirestoreDateUtility.timestampToDate(value),
      diff: number = date.getTime() - Date.now(),
      hours: number = Math.floor(diff / (3600 * 1000));

    return hours % 24 === 0;
  },
  timestampToDate: (value: firebase.firestore.FieldValue): Date => {
    const date: IFirestoreTimestamp = value as any;

    return new Date(date.seconds * 1000);
  },
  timestampToDateInput: (value: firebase.firestore.FieldValue): string => {
    const date: IFirestoreTimestamp = value as any;

    return DateUtility.dateToInput(new Date(date.seconds * 1000));
  },
  timestampToLocale: (value: firebase.firestore.FieldValue): string => {
    const timestamp: IFirestoreTimestamp = value as any;
    
    return DateUtility.secondsToLocale(timestamp.seconds);
  },
  timestampToRelative: (value: firebase.firestore.FieldValue): string => {
    const date: IFirestoreTimestamp = value as any;

    return DateUtility.secondsToRelative(date.seconds);
  },
  stringToOffsetTimestamp: (value: string): firebase.firestore.Timestamp => {
    return FirestoreDateUtility.dateToTimestamp(DateUtility.stringToOffsetDate(value));
  },
  stringToTimestamp: (value: string): firebase.firestore.Timestamp => {
    return FirestoreDateUtility.dateToTimestamp(new Date(value));
  }
}