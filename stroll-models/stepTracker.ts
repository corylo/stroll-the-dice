import firebase from "firebase/app";

import { StepTrackerUtility } from "../stroll-client/utilities/stepTrackerUtility";

import { StepTracker } from "../stroll-enums/stepTracker";

export interface IStepTracker {
  authorizationCode: string;
  name: StepTracker;  
}

export const defaultStepTracker = (): IStepTracker => ({
  authorizationCode: "",
  name: StepTracker.Unknown
});

export const stepTrackerConverter: firebase.firestore.FirestoreDataConverter<IStepTracker> = {
  toFirestore(tracker: IStepTracker): firebase.firestore.DocumentData {
    return {
      authorizationCode: tracker.authorizationCode
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): IStepTracker {
    const data: IStepTracker = snapshot.data(options) as IStepTracker;

    return {
      authorizationCode: data.authorizationCode,
      name: StepTrackerUtility.determineTrackerFromString(snapshot.id)
    }
  }
}