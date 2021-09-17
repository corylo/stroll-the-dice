import firebase from "firebase/app";

import { IGameDayHistoryEntry } from "../../../../stroll-models/gameDayHistoryEntry/gameDayHistoryEntry";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface IMyGameDaysPageStatuses {
  initial: RequestStatus;
  more: RequestStatus;
}

export const defaultMyGameDaysPageStatuses = (): IMyGameDaysPageStatuses => ({
  initial: RequestStatus.Loading,
  more: RequestStatus.Idle
});

export interface IMyGameDaysPageState {
  end: boolean;
  index: number;
  limit: number;
  entries: IGameDayHistoryEntry[];
  offset: firebase.firestore.QueryDocumentSnapshot;
  statuses: IMyGameDaysPageStatuses;
}

export const defaultMyGameDaysPageState = (): IMyGameDaysPageState => ({  
  end: false,
  index: 0,
  limit: 10,
  entries: [],
  offset: null,
  statuses: defaultMyGameDaysPageStatuses()
});