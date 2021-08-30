import firebase from "firebase/app";

import { IGameHistoryEntry } from "../../../../stroll-models/gameHistoryEntry";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface IViewGameHistoryStatuses {
  initial: RequestStatus;
  more: RequestStatus;
}

export const defaultViewGameHistoryStatuses = (): IViewGameHistoryStatuses => ({
  initial: RequestStatus.Loading,
  more: RequestStatus.Idle
});

export interface IViewGameHistoryState {
  end: boolean;
  entries: IGameHistoryEntry[];
  index: number;
  limit: number;
  offset: firebase.firestore.QueryDocumentSnapshot;
  statuses: IViewGameHistoryStatuses;
}

export const defaultViewGameHistoryState = (): IViewGameHistoryState => ({
  end: false,
  entries: [],
  index: 0,
  limit: 20,
  offset: null,
  statuses: defaultViewGameHistoryStatuses()
});