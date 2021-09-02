import firebase from "firebase-admin";

import { NumberUtility } from "../../../stroll-utilities/numberUtility";

import { INotification } from "../../../stroll-models/notification";

interface INotificationUtility {
  getRandomGoodLuckStatement: () => string;
  mapCreate: (text: string | string[], title: string, occurredAt: firebase.firestore.FieldValue, url?: string) => INotification;
}

export const NotificationUtility: INotificationUtility = {
  getRandomGoodLuckStatement: (): string => {
    const rand: number = NumberUtility.random(0, 3);

    switch(rand) {
      case 0:
        return "Good luck and have fun 😀.";
      case 1:
        return "You're gonna do great 🥇.";
      case 2:
        return "We believe in you 👍."
      case 3:
      default:
        return "Thanks for your support 🙌.";
    }
  },
  mapCreate: (text: string | string[], title: string, occurredAt: firebase.firestore.FieldValue, url?: string): INotification => {
    return {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      id: "",
      occurredAt,
      text,
      title,
      url: url || "",
      viewedAt: null
    }
  }
}