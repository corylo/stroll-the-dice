import firebase from "firebase/app";

import { IGameHistoryEntry } from "../../../../stroll-models/gameHistoryEntry";
import { defaultProfileGamesStats, IProfileGamesStats } from "../../../../stroll-models/profileStats";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface IStatsPageStatuses {
  initial: RequestStatus;
  more: RequestStatus;
  stats: RequestStatus;
}

export const defaultStatsPageStatuses = (): IStatsPageStatuses => ({
  initial: RequestStatus.Loading,
  more: RequestStatus.Idle,
  stats: RequestStatus.Loading
});

export interface IStatsPageState {
  end: boolean;
  entries: IGameHistoryEntry[];
  index: number;
  limit: number;
  offset: firebase.firestore.QueryDocumentSnapshot;
  stats: IProfileGamesStats;
  statuses: IStatsPageStatuses;
}

export const defaultStatsPageState = (): IStatsPageState => ({  
  end: false,
  entries: [],
  index: 0,
  limit: 10,
  offset: null,
  stats: defaultProfileGamesStats(),
  statuses: defaultStatsPageStatuses()
});