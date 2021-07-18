import firebase from "firebase/app";

import { DateUtility } from "./dateUtility";

import { IFirestoreTimestamp } from "../stroll-models/firestoreTimestamp";

interface IFirestoreDateUtility {
  add: (value: firebase.firestore.FieldValue, seconds: number) => number;
  dateToTimestamp: (date: Date) => firebase.firestore.Timestamp;
  diffInDays: (value: firebase.firestore.FieldValue) => number;  
  lessThanOrEqualToNow: (value: firebase.firestore.FieldValue) => boolean;
  timestampToDate: (value: firebase.firestore.FieldValue) => Date;
  timestampToDateInput: (value: firebase.firestore.FieldValue) => string;
  timestampToLocaleDate: (value: firebase.firestore.FieldValue) => string;
  timestampToLocaleDateTime: (value: firebase.firestore.FieldValue) => string;
  timestampToLocaleTime: (value: firebase.firestore.FieldValue) => string;
  timestampToRelative: (value: firebase.firestore.FieldValue) => string;
  timestampToRelativeOfUnit: (value: firebase.firestore.FieldValue, unit: "H" | "M" | "S") => number;
  stringToOffsetTimestamp: (value: string, hour?: number) => firebase.firestore.Timestamp;
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
  timestampToDate: (value: firebase.firestore.FieldValue): Date => {
    const date: IFirestoreTimestamp = value as any;

    return new Date(date.seconds * 1000);
  },
  timestampToDateInput: (value: firebase.firestore.FieldValue): string => {
    const date: IFirestoreTimestamp = value as any;

    return DateUtility.dateToInput(new Date(date.seconds * 1000));
  },
  timestampToLocaleDate: (value: firebase.firestore.FieldValue): string => {
    const date: Date = FirestoreDateUtility.timestampToDate(value);
    
    return date.toDateString();
  },
  timestampToLocaleDateTime: (value: firebase.firestore.FieldValue): string => {
    const date: string = FirestoreDateUtility.timestampToLocaleDate(value),
      time: string = FirestoreDateUtility.timestampToLocaleTime(value);

    return `${date} ${time}`;
  },
  timestampToLocaleTime: (value: firebase.firestore.FieldValue): string => {
    return FirestoreDateUtility.timestampToDate(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  },
  timestampToRelative: (value: firebase.firestore.FieldValue): string => {
    const date: IFirestoreTimestamp = value as any;

    return DateUtility.secondsToRelative(date.seconds);
  },
  timestampToRelativeOfUnit: (value: firebase.firestore.FieldValue, unit: "H" | "M" | "S"): number => {
    const date: IFirestoreTimestamp = value as any;

    return DateUtility.getRelativeOfUnit(date.seconds, unit);
  },
  stringToOffsetTimestamp: (value: string, hour?: number): firebase.firestore.Timestamp => {
    return FirestoreDateUtility.dateToTimestamp(DateUtility.stringToOffsetDate(value, hour));
  },
  stringToTimestamp: (value: string): firebase.firestore.Timestamp => {
    return FirestoreDateUtility.dateToTimestamp(new Date(value));
  }
}