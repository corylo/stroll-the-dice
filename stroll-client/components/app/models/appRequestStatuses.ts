import { defaultAppRequestStatus, IAppRequestStatus } from "./appRequestStatus";

export interface IAppRequestStatuses {  
  profile: IAppRequestStatus;
}

export const defaultAppRequestStatuses = (): IAppRequestStatuses => ({  
  profile: defaultAppRequestStatus()
});