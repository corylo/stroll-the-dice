import firebase from "firebase-admin";
import { config } from "firebase-functions";

import { StepTrackerRequestUtility } from "./stepTrackerRequestUtility";

import { IGoogleFitStepDataResponseBucketItem, IGoogleFitStepDataResponseBucketItemDataset, IGoogleFitStepDataResponseBucketItemDatasetPoint, IGoogleFitStepDataResponseBucketItemDatasetPointValue, IGoogleFitStepDataResponseData } from "../../../stroll-models/googleFitStepDataResponseData";

import { StepTracker } from "../../../stroll-enums/stepTracker";

interface IStepTrackerUtility {
  getAccessTokenRequestData: (code: string, origin: string) => string;
  getAccessTokenRequestHeaders: () => any;
  getOAuthUrl: (tracker: StepTracker) => string;
  getRefreshTokenRequestData: (refreshToken: string) => string;
  getOAuthRevokeUrl: (tracker: StepTracker) => string;
  getStepDataRequestBody: (tracker: StepTracker, startsAt: firebase.firestore.FieldValue, day: number, hasDayPassed: boolean) => any;
  getStepDataRequestHeaders: (accessToken: string) => any;
  getStepDataRequestUrl: (tracker: StepTracker) => string;
  mapStepsFromResponse: (data: IGoogleFitStepDataResponseData, currentStepTotal: number, hasDayPassed: boolean) => number;
}

export const StepTrackerUtility: IStepTrackerUtility = {
  getAccessTokenRequestData: (code: string, origin: string): string => {
    return `client_id=${config().google.fit.client_id}&client_secret=${config().google.fit.client_secret}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(`${origin}/profile/connect/google-fit`)}&code=${code}`;
  },
  getAccessTokenRequestHeaders: (): any => {
    return {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded" 
      }
    }
  },
  getOAuthUrl: (tracker: StepTracker): string => {
    switch(tracker) {
      case StepTracker.GoogleFit:
        return "https://oauth2.googleapis.com/token";
      default:
        throw new Error(`Unknown step tracker: ${tracker}`);
    }
  },
  getRefreshTokenRequestData: (refreshToken: string): string => {
    return `client_id=${config().google.fit.client_id}&client_secret=${config().google.fit.client_secret}&grant_type=refresh_token&refresh_token=${refreshToken}`;
  },
  getOAuthRevokeUrl: (tracker: StepTracker): string => {
    switch(tracker) {
      case StepTracker.GoogleFit:
        return "https://oauth2.googleapis.com/revoke?token=";
      default:
        throw new Error(`Unknown step tracker: ${tracker}`);
    }
  },
  getStepDataRequestBody: (tracker: StepTracker, startsAt: firebase.firestore.FieldValue, day: number, hasDayPassed: boolean): any => {
    switch(tracker) {
      case StepTracker.GoogleFit:
        return StepTrackerRequestUtility.getGoogleFitStepDataRequestBody(startsAt, day, hasDayPassed);
      default:
        throw new Error(`Unknown step tracker: ${tracker}`);
    }
  },
  getStepDataRequestHeaders: (accessToken: string): any => {
    return {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }
  },
  getStepDataRequestUrl: (tracker: StepTracker): string => {
    switch(tracker) {
      case StepTracker.GoogleFit:
        return "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate";
      default:
        throw new Error(`Unknown step tracker: ${tracker}`);
    }
  },
  mapStepsFromResponse: (data: IGoogleFitStepDataResponseData, currentStepTotal: number, hasDayPassed: boolean): number => {
    if(data && data.bucket && data.bucket.length > 0) {
      const item: IGoogleFitStepDataResponseBucketItem = data.bucket[0];

      if(item) {
        const dataset: IGoogleFitStepDataResponseBucketItemDataset = item.dataset[0];

        if(dataset) {
          const point: IGoogleFitStepDataResponseBucketItemDatasetPoint = dataset.point[0];

          if(point) {
            const value: IGoogleFitStepDataResponseBucketItemDatasetPointValue = point.value[0];

            if(value) {
              return value.intVal;
            }
          }
        }
      }
    }

    return currentStepTotal;
  }
}