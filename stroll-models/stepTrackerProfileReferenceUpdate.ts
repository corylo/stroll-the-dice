import { StepTracker } from "../stroll-enums/stepTracker";
import { StepTrackerConnectionStatus } from "../stroll-enums/stepTrackerConnectionStatus";

export interface IStepTrackerProfileReferenceUpdate {
  name?: StepTracker;
  status?: StepTrackerConnectionStatus;  
  timezone?: string;
}