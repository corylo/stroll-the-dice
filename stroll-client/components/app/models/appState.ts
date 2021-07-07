import { defaultAppToggles, IAppToggles } from "./appToggles";

import { defaultAppRequestStatuses, IAppRequestStatuses } from "./appRequestStatuses";
import { IStepTracker } from "../../../../stroll-models/stepTracker";
import { IUser } from "../../../models/user";

import { AppStatus } from "../../../enums/appStatus";

export interface IAppState {
  status: AppStatus;
  statuses: IAppRequestStatuses;
  toggles: IAppToggles;
  tracker: IStepTracker;
  user: IUser | null;
}

export const defaultAppState = (): IAppState => ({
  status: AppStatus.Loading,
  statuses: defaultAppRequestStatuses(),
  toggles: defaultAppToggles(),
  tracker: null,
  user: null
})