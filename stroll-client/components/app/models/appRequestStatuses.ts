import { defaultAppRequestStatus, IAppRequestStatus } from "./appRequestStatus";

export interface IAppRequestStatuses {  
  deleteAccount: IAppRequestStatus;
  profile: IAppRequestStatus;
  tracker: IAppRequestStatus;
}

export const defaultAppRequestStatuses = (): IAppRequestStatuses => ({  
  deleteAccount: defaultAppRequestStatus(),
  profile: defaultAppRequestStatus(),
  tracker: defaultAppRequestStatus()
});