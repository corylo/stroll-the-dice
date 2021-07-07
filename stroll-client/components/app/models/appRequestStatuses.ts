import { defaultAppRequestStatus, IAppRequestStatus } from "./appRequestStatus";

export interface IAppRequestStatuses {  
  profile: IAppRequestStatus;
  tracker: IAppRequestStatus;
}

export const defaultAppRequestStatuses = (): IAppRequestStatuses => ({  
  profile: defaultAppRequestStatus(),
  tracker: defaultAppRequestStatus()
});