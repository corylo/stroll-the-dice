import firebase from "firebase/app";

export interface INotification {  
  createdAt: firebase.firestore.FieldValue;
  id: string;
  occurredAt: firebase.firestore.FieldValue;
  text: string;
  title: string;
  url: string;
  viewedAt: firebase.firestore.FieldValue;
}

export const defaultNotification = (): INotification => ({
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  id: "",
  occurredAt: null,
  text: "",
  title: "",
  url: "",
  viewedAt: null
});

export const notificationConverter: any = {
  toFirestore(notification: INotification): firebase.firestore.DocumentData {
    return {
      createdAt: notification.createdAt,
      occurredAt: notification.occurredAt,
      text: notification.text,
      title: notification.title,
      url: notification.url,
      viewedAt: notification.viewedAt
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<INotification>
  ): INotification {
    const data: INotification = snapshot.data();

    return {
      createdAt: data.createdAt,
      id: snapshot.id,
      occurredAt: data.occurredAt,
      text: data.text,
      title: data.title,
      url: data.url,
      viewedAt: data.viewedAt
    }
  }
}