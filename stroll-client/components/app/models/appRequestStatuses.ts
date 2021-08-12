import { defaultAppRequestStatus, IAppRequestStatus } from "./appRequestStatus";

export interface IAppRequestStatuses {  
  deleteAccount: IAppRequestStatus;
  notifications: IAppRequestStatus;
  profile: IAppRequestStatus;
  tracker: IAppRequestStatus;
}

export const defaultAppRequestStatuses = (): IAppRequestStatuses => ({  
  deleteAccount: defaultAppRequestStatus(),
  notifications: defaultAppRequestStatus(),
  profile: defaultAppRequestStatus(),
  tracker: defaultAppRequestStatus()
});