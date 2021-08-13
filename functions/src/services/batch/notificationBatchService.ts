import firebase from "firebase-admin";

import { db } from "../../../config/firebase";

import { INotification, notificationConverter } from "../../../../stroll-models/notification";

import { ProfileStatsID } from "../../../../stroll-enums/profileStatsID";

interface INotificationBatchService {
  create: (uid: string, notification: INotification) => Promise<void>;
}

export const NotificationBatchService: INotificationBatchService = {
  create: async (uid: string, notification: INotification): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    const notificationRef: firebase.firestore.DocumentReference<INotification> =  db.collection("profiles")      
      .doc(uid)
      .collection("notifications")
      .doc()
      .withConverter<INotification>(notificationConverter);

    batch.set(notificationRef, notification);

    const notificationStatsRef: firebase.firestore.DocumentReference = db.collection("profiles")
      .doc(uid)
      .collection("stats")
      .doc(ProfileStatsID.Notifications);

    batch.update(notificationStatsRef, { 
      total: firebase.firestore.FieldValue.increment(1),
      unviewed: firebase.firestore.FieldValue.increment(1)
    });

    await batch.commit();
  }
}