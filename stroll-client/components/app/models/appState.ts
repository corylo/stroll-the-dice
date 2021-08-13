import { defaultAppToggles, IAppToggles } from "./appToggles";

import { defaultAppRequestStatuses, IAppRequestStatuses } from "./appRequestStatuses";
import { INotification } from "../../../../stroll-models/notification";
import { defaultUser, IUser } from "../../../models/user";

import { AppStatus } from "../../../enums/appStatus";

export interface IAppState {
  notifications: INotification[];
  status: AppStatus;
  statuses: IAppRequestStatuses;
  toggles: IAppToggles;
  user: IUser;
}

export const defaultAppState = (): IAppState => ({
  notifications: [],
  status: AppStatus.Loading,
  statuses: defaultAppRequestStatuses(),
  toggles: defaultAppToggles(),
  user: defaultUser()
})