import firebase from "firebase-admin";

import { INotification } from "../../../stroll-models/notification";

interface INotificationUtility {
  mapCreate: (text: string, title: string, occurredAt: firebase.firestore.FieldValue, url?: string) => INotification;
}

export const NotificationUtility: INotificationUtility = {
  mapCreate: (text: string, title: string, occurredAt: firebase.firestore.FieldValue, url?: string): INotification => {
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