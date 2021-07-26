import firebase from "firebase/app";

import { DateUtility } from "./dateUtility";

import { IFirestoreTimestamp } from "../stroll-models/firestoreTimestamp";

interface IFirestoreDateUtility {
  add: (value: firebase.firestore.FieldValue, seconds: number) => number;
  beginningOfHour: (occurredAt: firebase.firestore.FieldValue) => firebase.firestore.FieldValue;
  dateToTimestamp: (date: Date) => firebase.firestore.Timestamp;
  daysToMillis: (days: number) => number;  
  diffInDays: (value: firebase.firestore.FieldValue) => number;  
  endOfDay: (day: number, startsAt: firebase.firestore.FieldValue) => firebase.firestore.FieldValue;
  endOfDayProgressUpdateComplete: (day: number, startsAt: firebase.firestore.FieldValue, progressUpdateAt: firebase.firestore.FieldValue) => boolean;
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
  diffInDays: (value: firebase.firestore.FieldValue): number => {
    return DateUtility.diffInDays(FirestoreDateUtility.timestampToDateInput(value));
  },
  endOfDay: (day: number, startsAt: firebase.firestore.Timestamp): firebase.firestore.Timestamp => {
    const dayAsSeconds: number = FirestoreDateUtility.daysToMillis(day) / 1000,
      seconds: number = FirestoreDateUtility.add(startsAt, dayAsSeconds),
      date: Date = new Date(seconds * 1000);

    return FirestoreDateUtility.dateToTimestamp(date);
  },
  endOfDayProgressUpdateComplete: (day: number, startsAt: firebase.firestore.FieldValue, progressUpdateAt: firebase.firestore.FieldValue): boolean => {    
    const endOfDayTimestamp: firebase.firestore.FieldValue = FirestoreDateUtility.endOfDay(day, startsAt);
    
    const endOfDayDate: Date = FirestoreDateUtility.timestampToDate(endOfDayTimestamp),
      progressUpdateAtDate: Date = FirestoreDateUtility.timestampToDate(progressUpdateAt);
    
    return progressUpdateAtDate.getTime() >= endOfDayDate.getTime();
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
    return FirestoreDateUtility.timestampToDate(value).toLocaleTimeString([], { hour: "numeric" });
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