import { IStepTracker } from "./stepTracker";

export interface IConnectStepTrackerRequest {
  authorizationCode: string;
  tracker: IStepTracker;
  uid: string;
}