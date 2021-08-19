import firebase from "firebase-admin";

import { DateUtility } from "../../../stroll-utilities/dateUtility";
import { FirestoreDateUtility } from "./firestoreDateUtility";

interface IStepTrackerRequestUtility {
  getFitbitStepDataRequestUrlPath: (startsAt: firebase.firestore.FieldValue, day: number, timezone: string) => string;
  getGoogleFitStepDataRequestBody: (startsAt: firebase.firestore.FieldValue, day: number) => any;
}

export const StepTrackerRequestUtility: IStepTrackerRequestUtility = {
  getFitbitStepDataRequestUrlPath: (startsAt: firebase.firestore.FieldValue, day: number, timezone: string): string => {
    const start: Date = DateUtility.dateToTimezoneOffsetDate(FirestoreDateUtility.timestampToDate(startsAt), timezone),
      end: Date = new Date(start);

    const startDateValue: number = start.getDate() + (day - 1),
      endDateValue: number = startDateValue + 1;

    start.setDate(startDateValue);

    end.setDate(endDateValue);
    end.setHours(end.getHours() - 1);

    const formattedStartDateString: string = start.toISOString().split("T")[0],
      formattedStartHourString: string = start.getHours() < 10 ? `0${start.getHours()}` : start.getHours().toString(),
      formattedStartTimeString: string = `${formattedStartHourString}:00`;

    const formattedEndDateString: string = end.toISOString().split("T")[0],
      formattedEndHourString: string = end.getHours() < 10 ? `0${end.getHours()}` : end.getHours().toString(),
      formattedEndTimeString: string = `${formattedEndHourString}:59`;

    return `/1/user/-/activities/steps/date/${formattedStartDateString}/${formattedEndDateString}/15min/time/${encodeURIComponent(formattedStartTimeString)}/${encodeURIComponent(formattedEndTimeString)}.json`;
  },
  getGoogleFitStepDataRequestBody: (startsAt: firebase.firestore.FieldValue, day: number): any => {
    const start: Date = FirestoreDateUtility.timestampToDate(startsAt),
      end: Date = FirestoreDateUtility.timestampToDate(startsAt);

    const startDateValue: number = start.getDate() + (day - 1),
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