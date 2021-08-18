import firebase from "firebase-admin";
import { config, logger } from "firebase-functions";

import { StepTrackerRequestUtility } from "./stepTrackerRequestUtility";

import { IFitbitStepDataResponse, IFitbitStepDataResponseActivitiesStepsSummaryItem } from "../../../stroll-models/fitbitStepDataResponse";
import { 
  IGoogleFitStepDataResponseBucketItem, 
  IGoogleFitStepDataResponseBucketItemDataset, 
  IGoogleFitStepDataResponseBucketItemDatasetPoint, 
  IGoogleFitStepDataResponseBucketItemDatasetPointValue, 
  IGoogleFitStepDataResponse 
} from "../../../stroll-models/googleFitStepDataResponse";

import { StepTracker } from "../../../stroll-enums/stepTracker";

interface IStepTrackerUtility {
  getAccessTokenRequestData: (tracker: StepTracker, code: string, origin: string) => string;
  getAccessTokenRequestHeaders: (tracker: StepTracker) => any;
  getOAuthUrl: (tracker: StepTracker) => string;
  getRefreshTokenRequestData: (tracker: StepTracker, refreshToken: string) => string;
  getOAuthRevokeUrl: (tracker: StepTracker, token: string) => string;
  getStepDataRequestBody: (tracker: StepTracker, startsAt: firebase.firestore.FieldValue, day: number, hasDayPassed: boolean) => any;
  getStepDataRequestHeaders: (accessToken: string) => any;
  getStepDataRequestUrl: (tracker: StepTracker, startsAt: firebase.firestore.FieldValue, day: number, hasDayPassed: boolean, timezone: string) => string;
  isValidStepTracker: (tracker: StepTracker) => boolean;
  mapStepsFromResponse: (tracker: StepTracker, data: IGoogleFitStepDataResponse | IFitbitStepDataResponse, currentStepTotal: number) => number;
}

export const StepTrackerUtility: IStepTrackerUtility = {
  getAccessTokenRequestData: (tracker: StepTracker, code: string, origin: string): string => {
    switch(tracker) {
      case StepTracker.GoogleFit:
        return `client_id=${config().google.oauth.client_id}&client_secret=${config().google.oauth.client_secret}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(`${origin}/profile/connect/google-fit`)}&code=${code}`;
      case StepTracker.Fitbit:
        return `client_id=${config().fitbit.oauth.client_id}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(`${origin}/profile/connect/fitbit`)}&code=${code}`;
      default:
        throw new Error(`Unknown step tracker: ${tracker}`);
    }
  },
  getAccessTokenRequestHeaders: (tracker: StepTracker): any => {
    switch(tracker) {
      case StepTracker.GoogleFit:
        return {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded" 
          }
        }
      case StepTracker.Fitbit:
        const encodedOAuthCredentials: string = Buffer.from(`${config().fitbit.oauth.client_id}:${config().fitbit.oauth.client_secret}`).toString("base64");

        return {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${encodedOAuthCredentials}`
          }
        }
      default:
        throw new Error(`Unknown step tracker: ${tracker}`);
    }
  },
  getOAuthUrl: (tracker: StepTracker): string => {
    switch(tracker) {
      case StepTracker.GoogleFit:
        return "https://oauth2.googleapis.com/token";
      case StepTracker.Fitbit:
        return "https://api.fitbit.com/oauth2/token";
      default:
        throw new Error(`Unknown step tracker: ${tracker}`);
    }
  },
  getRefreshTokenRequestData: (tracker: StepTracker, refreshToken: string): string => {
    switch(tracker) {
      case StepTracker.GoogleFit:
        return `client_id=${config().google.oauth.client_id}&client_secret=${config().google.oauth.client_secret}&grant_type=refresh_token&refresh_token=${refreshToken}`;
      case StepTracker.Fitbit:
        return `client_id=${config().fitbit.oauth.client_id}&grant_type=refresh_token&refresh_token=${refreshToken}`;
      default:
        throw new Error(`Unknown step tracker: ${tracker}`);
    }
  },
  getOAuthRevokeUrl: (tracker: StepTracker, token: string): string => {
    switch(tracker) {
      case StepTracker.GoogleFit:
        return `https://oauth2.googleapis.com/revoke?token=${token}`;
      case StepTracker.Fitbit:
        return `https://api.fitbit.com/oauth2/revoke?token=${token}`;
      default:
        throw new Error(`Unknown step tracker: ${tracker}`);
    }
  },
  getStepDataRequestBody: (tracker: StepTracker, startsAt: firebase.firestore.FieldValue, day: number, hasDayPassed: boolean): any => {
    switch(tracker) {
      case StepTracker.Fitbit:
        return {};
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
  getStepDataRequestUrl: (tracker: StepTracker, startsAt: firebase.firestore.FieldValue, day: number, hasDayPassed: boolean, timezone: string): string => {
    switch(tracker) {
      case StepTracker.GoogleFit:
        return "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate";
      case StepTracker.Fitbit:
        return `https://api.fitbit.com${StepTrackerRequestUtility.getFitbitStepDataRequestUrlPath(startsAt, day, hasDayPassed, timezone)}`;
      default:
        throw new Error(`Unknown step tracker: ${tracker}`);
    }
  },
  isValidStepTracker: (tracker: StepTracker): boolean => {
    switch(tracker) {
      case StepTracker.Fitbit:
      case StepTracker.GoogleFit:
        return true;
      default:
        throw new Error(`Unknown step tracker: ${tracker}`);
    }
  },
  mapStepsFromResponse: (tracker: StepTracker, data: IGoogleFitStepDataResponse | IFitbitStepDataResponse, currentStepTotal: number): number => {
    if(tracker === StepTracker.GoogleFit) {
      data = data as IGoogleFitStepDataResponse;

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
            } else {
              return currentStepTotal;
            }
          }
        }
      }

      throw new Error(`Unable to map response for tracker [${tracker}].`);
    } else if (tracker === StepTracker.Fitbit) {
      data = data as IFitbitStepDataResponse;

      if(data && data["activities-steps"] && data["activities-steps"].length > 0) {
        const item: IFitbitStepDataResponseActivitiesStepsSummaryItem = data["activities-steps"][0];

        if(item && item.value) {
          return parseInt(item.value);
        }
      }

      throw new Error(`Unable to map response for tracker [${tracker}].`);
    }

    throw new Error(`Unknown step tracker: ${tracker}`);
  }
}