import { IGameEvent } from "../../../../../../stroll-models/gameEvent/gameEvent";

import { GameEventCategory } from "../../../../../../stroll-enums/gameEventCategory";
import { RequestStatus } from "../../../../../../stroll-enums/requestStatus";

export interface IViewGameTimelineState {
  events: IGameEvent[];
  category: GameEventCategory;
  status: RequestStatus;
}

export const defaultViewGameTimelineState = (): IViewGameTimelineState => ({
  events: [],
  category: GameEventCategory.Game,
  status: RequestStatus.Idle
});