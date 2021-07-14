import { IGameEvent } from "../../../../stroll-models/gameEvent/gameEvent";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface IViewEventsModalState {
  events: IGameEvent[];
  status: RequestStatus;
}