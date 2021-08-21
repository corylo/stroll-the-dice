import firebase from "firebase/app";

import { INotification } from "../../../../stroll-models/notification";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface INotificationsPageStatuses {
  initial: RequestStatus;
  more: RequestStatus;
}

export const defaultNotificationsPageStatuses = (): INotificationsPageStatuses => ({
  initial: RequestStatus.Loading,
  more: RequestStatus.Idle
});

export interface INotificationsPageState {
  end: boolean;
  index: number;
  limit: number;
  notifications: INotification[];
  offset: firebase.firestore.QueryDocumentSnapshot;
  statuses: INotificationsPageStatuses;
}

export const defaultNotificationsPageState = (): INotificationsPageState => ({  
  end: false,
  index: 0,
  limit: 10,
  notifications: [],
  offset: null,
  statuses: defaultNotificationsPageStatuses()
});