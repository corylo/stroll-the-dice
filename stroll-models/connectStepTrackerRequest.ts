import { IStepTracker } from "./stepTracker";

export interface IConnectStepTrackerRequest {
  authorizationCode: string;
  origin: string;
  tracker: IStepTracker;
  uid: string;  
}