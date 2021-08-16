import { functions } from "../config/firebase";

import { IStepTracker } from "../../stroll-models/stepTracker";

interface IStepTrackerService {
  connect: (authorizationCode: string, uid: string, tracker: IStepTracker) => Promise<void>;
  disconnect: () => Promise<void>;
}

export const StepTrackerService: IStepTrackerService = {
  connect: async (authorizationCode: string, uid: string, tracker: IStepTracker): Promise<void> => {
    await functions.httpsCallable("connectStepTracker")({
      authorizationCode,
      uid,
      tracker,
      origin: window.location.origin
    });
  },
  disconnect: async (): Promise<void> => {
    await functions.httpsCallable("disconnectStepTracker")();
  }
}