import firebase from "firebase/app";

import { StepTrackerUtility } from "../stroll-client/utilities/stepTrackerUtility";

import { StepTracker } from "../stroll-enums/stepTracker";

export interface IStepTracker {  
  accessToken: string;
  name: StepTracker;  
  refreshToken: string;
  userID: string;
}

export const defaultStepTracker = (): IStepTracker => ({
  accessToken: "",
  name: StepTracker.Unknown,
  refreshToken: "",
  userID: ""
});

export const stepTrackerConverter: any = {
  toFirestore(tracker: IStepTracker): firebase.firestore.DocumentData {
    return {
      accessToken: tracker.accessToken,
      refreshToken: tracker.refreshToken,
      userID: tracker.userID
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IStepTracker>
  ): IStepTracker {
    const data: IStepTracker = snapshot.data();

    return {
      accessToken: data.accessToken,
      name: StepTrackerUtility.determineTrackerFromString(snapshot.id),      
      refreshToken: data.refreshToken,
      userID: data.userID
    }
  }
}