import firebase from "firebase/app";

import { db } from "../config/firebase";

import { INotification, notificationConverter } from "../../stroll-models/notification";
import { IProfileNotificationStats } from "../../stroll-models/profileStats";

import { ProfileStatsID } from "../../stroll-enums/profileStatsID";

interface INotificationService {
  getAll: (uid: string, limit: number) => Promise<INotification[]>;
  view: (uid: string, id: string) => Promise<void>;
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
  },
  view: async (uid: string, id: string): Promise<void> => {
    await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
      const notificationStatsRef: firebase.firestore.DocumentReference = db.collection("profiles")
        .doc(uid)
        .collection("stats")
        .doc(ProfileStatsID.Notifications);

      const notificationRef: firebase.firestore.DocumentReference = db.collection("profiles")
        .doc(uid)
        .collection("notifications")
        .doc(id);

      const notificationStatsDoc: firebase.firestore.DocumentSnapshot = await transaction.get(notificationStatsRef);

      if(notificationStatsDoc.exists) {
        const notificationStats: IProfileNotificationStats = notificationStatsDoc.data() as IProfileNotificationStats;

        transaction.update(notificationStatsRef, {
          lastViewed: id,
          unviewed: notificationStats.unviewed - 1,
          viewed: notificationStats.viewed + 1
        });

        transaction.update(notificationRef, { viewedAt: firebase.firestore.FieldValue.serverTimestamp() });
      }
    });
  }
}