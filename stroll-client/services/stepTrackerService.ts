import { functions } from "../config/firebase";

import { DateUtility } from "../../stroll-utilities/dateUtility";

import { IStepTracker } from "../../stroll-models/stepTracker";

interface IStepTrackerService {
  connect: (authorizationCode: string, uid: string, tracker: IStepTracker) => Promise<void>;  
  disconnect: () => Promise<void>;
  verify: () => Promise<void>;
}

export const StepTrackerService: IStepTrackerService = {
  connect: async (authorizationCode: string, uid: string, tracker: IStepTracker): Promise<void> => {
    await functions.httpsCallable("connectStepTracker")({
      authorizationCode,
      timezone: DateUtility.getCurrentTimezone(),
      tracker,
      uid,
      origin: window.location.origin
    });
  },
  disconnect: async (): Promise<void> => {
    await functions.httpsCallable("disconnectStepTracker")();
  },
  verify: async (): Promise<void> => {
    await functions.httpsCallable("verifyStepTracker")();
  }
}