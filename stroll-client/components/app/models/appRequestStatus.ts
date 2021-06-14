import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface IAppRequestStatus {
  is: RequestStatus;
  message: string;
}

export const defaultAppRequestStatus = (): IAppRequestStatus => ({
  is: RequestStatus.Idle,
  message: ""
});