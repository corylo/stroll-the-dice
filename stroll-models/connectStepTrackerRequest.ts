import { IStepTracker } from "./stepTracker";

export interface IConnectStepTrackerRequest {
  authorizationCode: string;
  origin: string;
  timezone: string;
  tracker: IStepTracker;
  uid: string;  
}