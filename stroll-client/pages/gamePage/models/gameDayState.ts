import { IGameDaySummaryPlayerReference } from "../../../../stroll-models/gameDaySummary";
import { IMatchup } from "../../../../stroll-models/matchup";
import { IPrediction } from "../../../../stroll-models/prediction";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface IGameDayStateStatuses {
  matchups: RequestStatus;  
  predictions: RequestStatus;
  summary: RequestStatus;
}

export const defaultGameDayStateStatuses = (): IGameDayStateStatuses => ({  
  matchups: RequestStatus.Loading,  
  predictions: RequestStatus.Loading,
  summary: RequestStatus.Loading
});

export interface IGameDayState {
  expanded: boolean;
  matchups: IMatchup[];
  players: IGameDaySummaryPlayerReference[];
  predictions: IPrediction[];
  statuses: IGameDayStateStatuses;
}

export const defaultGameDayState = (): IGameDayState => ({  
  expanded: false,
  matchups: [],
  players: [],
  predictions: [],
  statuses: defaultGameDayStateStatuses()
});