import firebase from "firebase/app";

import { db } from "../config/firebase";

import { INotification, notificationConverter } from "../../stroll-models/notification";

interface INotificationService {
  getAll: (uid: string, limit: number) => Promise<INotification[]>;
}

export const NotificationService: INotificationService = {
  getAll: async (uid: string, limit: number): Promise<INotification[]> => {
    const snap: firebase.firestore.QuerySnapshot = await db.collection("profiles")
      .doc(uid)
      .collection("notifications")
      .orderBy("createdAt")
      .limit(limit)
      .withConverter(notificationConverter)
      .get();

    let notifications: INotification[] = [];

    snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<INotification>) => 
      notifications.push(doc.data()));
    
    return notifications;
  }
}