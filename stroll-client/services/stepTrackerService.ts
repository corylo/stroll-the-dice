import { functions } from "../firebase";

import { IStepTracker } from "../../stroll-models/stepTracker";

interface IStepTrackerService {
  connect: (authorizationCode: string, uid: string, tracker: IStepTracker) => Promise<void>;
}

export const StepTrackerService: IStepTrackerService = {
  connect: async (authorizationCode: string, uid: string, tracker: IStepTracker): Promise<void> => {
    try {
      await functions.httpsCallable("connectStepTracker")({
        authorizationCode,
        uid,
        tracker
      });
    } catch (err) {
      console.error(err);
    }
  }
}