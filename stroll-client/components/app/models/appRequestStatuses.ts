import { defaultAppRequestStatus, IAppRequestStatus } from "./appRequestStatus";

export interface IAppRequestStatuses {  
  deleteAccount: IAppRequestStatus;
  notifications: IAppRequestStatus;
  profile: IAppRequestStatus;
  roles: IAppRequestStatus;
}

export const defaultAppRequestStatuses = (): IAppRequestStatuses => ({  
  deleteAccount: defaultAppRequestStatus(),
  notifications: defaultAppRequestStatus(),
  profile: defaultAppRequestStatus(),
  roles: defaultAppRequestStatus()
});