import firebase from "firebase/app";

import { db } from "../firebase";

import { IStepTracker, stepTrackerConverter } from "../../stroll-models/stepTracker";

interface IStepTrackerService {
  create: (uid: string, tracker: IStepTracker) => Promise<void>;
  get: (uid: string) => Promise<IStepTracker>;
}

export const StepTrackerService: IStepTrackerService = {
  create: async (uid: string, tracker: IStepTracker): Promise<void> => {
    return await db.collection("profiles")
      .doc(uid)
      .collection("trackers")
      .doc(tracker.name)
      .withConverter(stepTrackerConverter)
      .set(tracker);
  },
  get: async (uid: string): Promise<IStepTracker> => {
    if(uid !== "") {
      try {
        const snap: firebase.firestore.QuerySnapshot = await db.collection("profiles")
          .doc(uid)
          .collection("trackers")
          .withConverter(stepTrackerConverter)
          .get();

        if(!snap.empty && snap.size === 1) {
          let trackers: IStepTracker[] = [];

          snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IStepTracker>) => 
            trackers.push(doc.data()));

          return trackers[0];
        }

        throw new Error(`Expected 1 tracker. Returned ${snap.size} trackers.`);
      } catch (err) {
        return null;
      }
    }
  }
}