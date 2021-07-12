import { IMatchup } from "../../../../stroll-models/matchup";
import { IPrediction } from "../../../../stroll-models/prediction";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface IMatchupListStateStatuses {
  matchups: RequestStatus;
  predictions: RequestStatus;
}

export const defaultMatchupListStateStatuses = (): IMatchupListStateStatuses => ({  
  matchups: RequestStatus.Loading,
  predictions: RequestStatus.Loading
});

export interface IMatchupListState {
  matchups: IMatchup[];
  predictions: IPrediction[];
  statuses: IMatchupListStateStatuses;
}

export const defaultMatchupListState = (): IMatchupListState => ({  
  matchups: [],
  predictions: [],
  statuses: defaultMatchupListStateStatuses()
});