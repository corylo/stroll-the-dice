import { functions } from "../firebase";

import { IStepTracker } from "../../stroll-models/stepTracker";

interface IStepTrackerService {
  connect: (authorizationCode: string, uid: string, tracker: IStepTracker) => Promise<void>;
  disconnect: () => Promise<void>;
}

export const StepTrackerService: IStepTrackerService = {
  connect: async (authorizationCode: string, uid: string, tracker: IStepTracker): Promise<void> => {
    try {
      await functions.httpsCallable("connectStepTracker")({
        authorizationCode,
        uid,
        tracker,
        origin: window.location.origin
      });
    } catch (err) {
      console.error(err);
    }
  },
  disconnect: async (): Promise<void> => {
    try {
      await functions.httpsCallable("disconnectStepTracker")();
    } catch (err) {
      console.error(err);
    }
  }
}