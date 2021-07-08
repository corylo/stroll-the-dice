import firebase from "firebase/app";

import { StepTrackerUtility } from "../stroll-client/utilities/stepTrackerUtility";

import { StepTracker } from "../stroll-enums/stepTracker";

export interface IStepTracker {  
  name: StepTracker;  
  refreshToken: string;
}

export const defaultStepTracker = (): IStepTracker => ({
  name: StepTracker.Unknown,
  refreshToken: ""
});

export const stepTrackerConverter: any = {
  toFirestore(tracker: IStepTracker): firebase.firestore.DocumentData {
    return {
      refreshToken: tracker.refreshToken
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IStepTracker>
  ): IStepTracker {
    const data: IStepTracker = snapshot.data();

    return {
      name: StepTrackerUtility.determineTrackerFromString(snapshot.id),      
      refreshToken: data.refreshToken
    }
  }
}