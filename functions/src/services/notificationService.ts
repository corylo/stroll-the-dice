import { db } from "../../config/firebase";

import { INotification, notificationConverter } from "../../../stroll-models/notification";

interface INotificationService {
  create: (uid: string, notification: INotification) => Promise<void>;
}

export const NotificationService: INotificationService = {
  create: async (uid: string, notification: INotification): Promise<void> => {
    await db.collection("profiles")      
      .doc(uid)
      .collection("notifications")
      .withConverter(notificationConverter)
      .add(notification);
  }
}