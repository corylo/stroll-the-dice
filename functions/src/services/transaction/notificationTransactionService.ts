import firebase from "firebase-admin";

import { db } from "../../../config/firebase";

import { INotification, notificationConverter } from "../../../../stroll-models/notification";

import { ProfileStatsID } from "../../../../stroll-enums/profileStatsID";

interface INotificationTransactionService {
  create: (transaction: firebase.firestore.Transaction, uid: string, notification: INotification) => void;
}

export const NotificationTransactionService: INotificationTransactionService = {
  create: (transaction: firebase.firestore.Transaction, uid: string, notification: INotification): void => {    
    const notificationRef: firebase.firestore.DocumentReference<INotification> =  db.collection("profiles")      
      .doc(uid)
      .collection("notifications")
      .doc()
      .withConverter<INotification>(notificationConverter);

    transaction.set(notificationRef, notification);

    const notificationStatsRef: firebase.firestore.DocumentReference = db.collection("profiles")
      .doc(uid)
      .collection("stats")
      .doc(ProfileStatsID.Notifications);

    transaction.update(notificationStatsRef, { 
      total: firebase.firestore.FieldValue.increment(1),
      unviewed: firebase.firestore.FieldValue.increment(1)
    });
  }
}