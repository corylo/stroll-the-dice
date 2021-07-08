import { defaultAppToggles, IAppToggles } from "./appToggles";

import { defaultAppRequestStatuses, IAppRequestStatuses } from "./appRequestStatuses";
import { IUser } from "../../../models/user";

import { AppStatus } from "../../../enums/appStatus";

export interface IAppState {
  status: AppStatus;
  statuses: IAppRequestStatuses;
  toggles: IAppToggles;
  user: IUser | null;
}

export const defaultAppState = (): IAppState => ({
  status: AppStatus.Loading,
  statuses: defaultAppRequestStatuses(),
  toggles: defaultAppToggles(),
  user: null
})