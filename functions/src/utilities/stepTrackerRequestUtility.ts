import firebase from "firebase-admin";

import { FirestoreDateUtility } from "../../../stroll-utilities/firestoreDateUtility";

interface IStepTrackerRequestUtility {
  getGoogleFitStepDataRequestBody: (startsAt: firebase.firestore.FieldValue, day: number, hasDayPassed: boolean) => any;
}

export const StepTrackerRequestUtility: IStepTrackerRequestUtility = {
  getGoogleFitStepDataRequestBody: (startsAt: firebase.firestore.FieldValue, day: number, hasDayPassed: boolean): any => {
    const start: Date = FirestoreDateUtility.timestampToDate(startsAt),
      end: Date = FirestoreDateUtility.timestampToDate(startsAt);

    const dayOffset: number = hasDayPassed ? day - 2 : day - 1,
      startDateValue: number = start.getDate() + dayOffset,
      endDateValue: number = startDateValue + 1;

    start.setDate(startDateValue);

    end.setDate(endDateValue);
    end.setMilliseconds(end.getMilliseconds() - 1);

    return {
      aggregateBy: [{
        dataTypeName: "com.google.step_count.delta",
        dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
      }],
      bucketByTime: { 
        durationMillis: 86400000 
      },
      startTimeMillis: start.getTime(),
      endTimeMillis: end.getTime()
    }
  }
}