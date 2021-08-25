import firebase from "firebase/app";

import { defaultAppToggles, IAppToggles } from "./appToggles";

import { defaultAppRequestStatuses, IAppRequestStatuses } from "./appRequestStatuses";
import { defaultUser, IUser } from "../../../models/user";

import { AppStatus } from "../../../enums/appStatus";
import { CookieStatus } from "../../../enums/cookieStatus";

export interface IAppState {
  analytics: firebase.analytics.Analytics;
  cookieStatus: CookieStatus;
  status: AppStatus;
  statuses: IAppRequestStatuses;
  toggles: IAppToggles;
  user: IUser;
}

export const defaultAppState = (): IAppState => ({
  analytics: null,
  cookieStatus: CookieStatus.Loading,
  status: AppStatus.Loading,
  statuses: defaultAppRequestStatuses(),
  toggles: defaultAppToggles(),
  user: defaultUser()
})