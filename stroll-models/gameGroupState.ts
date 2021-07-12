import { IGameGroup } from "./gameGroup";

import { RequestStatus } from "../stroll-enums/requestStatus";

export interface IGameGroupState {  
  groups: IGameGroup[]
  status: RequestStatus;
}

export const defaultGameGroupState = (): IGameGroupState => ({
  groups: [],
  status: RequestStatus.Loading
});