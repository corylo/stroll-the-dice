import firebase from "firebase/app";

import { IGameEvent } from "../../../../../../stroll-models/gameEvent/gameEvent";

import { GameEventCategory } from "../../../../../../stroll-enums/gameEventCategory";
import { RequestStatus } from "../../../../../../stroll-enums/requestStatus";

export interface IViewGameTimelineStatuses {
  initial: RequestStatus;
  more: RequestStatus;
}

export const defaultViewGameTimelineStatuses = (): IViewGameTimelineStatuses => ({
  initial: RequestStatus.Loading,
  more: RequestStatus.Idle
});

export interface IViewGameTimelineState {
  category: GameEventCategory;
  end: boolean;
  events: IGameEvent[];  
  index: number;
  limit: number;
  offset: firebase.firestore.QueryDocumentSnapshot;
  statuses: IViewGameTimelineStatuses;
}

export const defaultViewGameTimelineState = (): IViewGameTimelineState => ({
  category: GameEventCategory.Game,
  end: false,
  events: [],
  index: 0,
  limit: 20,
  offset: null,
  statuses: defaultViewGameTimelineStatuses()
});