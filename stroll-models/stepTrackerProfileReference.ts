import { StepTracker } from "../stroll-enums/stepTracker";
import { StepTrackerConnectionStatus } from "../stroll-enums/stepTrackerConnectionStatus";

export interface IStepTrackerProfileReference {
  name: StepTracker;
  status: StepTrackerConnectionStatus;  
  timezone: string;
}

export const defaultStepTrackerProfileReference = (): IStepTrackerProfileReference => ({
  name: StepTracker.Unknown,
  status: StepTrackerConnectionStatus.Idle,
  timezone: ""
});