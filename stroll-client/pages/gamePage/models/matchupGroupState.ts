import { IMatchup } from "../../../../stroll-models/matchup";
import { IPrediction } from "../../../../stroll-models/prediction";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface IMatchupGroupStateStatuses {
  matchups: RequestStatus;
  predictions: RequestStatus;
}

export const defaultMatchupGroupStateStatuses = (): IMatchupGroupStateStatuses => ({  
  matchups: RequestStatus.Loading,
  predictions: RequestStatus.Loading
});

export interface IMatchupGroupState {
  expanded: boolean;
  matchups: IMatchup[];
  predictions: IPrediction[];
  statuses: IMatchupGroupStateStatuses;
}

export const defaultMatchupGroupState = (): IMatchupGroupState => ({  
  expanded: false,
  matchups: [],
  predictions: [],
  statuses: defaultMatchupGroupStateStatuses()
});