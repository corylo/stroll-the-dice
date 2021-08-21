import firebase from "firebase/app";

import { IGame } from "../../../../stroll-models/game";

import { GameStatus } from "../../../../stroll-enums/gameStatus";
import { GroupGameBy } from "../../../../stroll-enums/groupGameBy";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface IMyGamesPageStatuses {
  initial: RequestStatus;
  more: RequestStatus;
}

export const defaultMyGamesPageStatuses = (): IMyGamesPageStatuses => ({
  initial: RequestStatus.Loading,
  more: RequestStatus.Idle
});

export interface IMyGamesPageState {
  end: boolean;
  games: IGame[];  
  groupBy: GroupGameBy;
  index: number;
  limit: number;
  offset: firebase.firestore.QueryDocumentSnapshot;
  status: GameStatus;
  statuses: IMyGamesPageStatuses;
}

export const defaultMyGamesPageState = (): IMyGamesPageState => ({  
  end: false,
  games: [],
  groupBy: GroupGameBy.Hosting,
  index: 0,
  limit: 2,
  offset: null,
  status: null,
  statuses: defaultMyGamesPageStatuses()
});