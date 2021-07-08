import { StepTrackerRequestUtility } from "./stepTrackerRequestUtility";

import { IGame } from "../../../stroll-models/game";

import { GoogleFitConfig } from "../../../config/googleFitConfig"
import { StepTracker } from "../../../stroll-enums/stepTracker";

interface IStepTrackerUtility {
  getAccessTokenRequestData: (code: string) => string;
  getAccessTokenRequestHeaders: () => any;
  getOAuthUrl: (tracker: StepTracker) => string;
  getRefreshTokenRequestData: (refreshToken: string) => string;
  getStepDataRequestBody: (game: IGame, tracker: StepTracker) => any;
  getStepDataRequestHeaders: (accessToken: string) => any;
  getStepDataRequestUrl: (tracker: StepTracker) => string;
  mapStepsFromResponse: (data: any) => number;
}

export const StepTrackerUtility: IStepTrackerUtility = {
  getAccessTokenRequestData: (code: string): string => {
    return `client_id=${GoogleFitConfig.ClientID}&client_secret=${GoogleFitConfig.ClientSecret}&grant_type=authorization_code&redirect_uri=${encodeURIComponent("http://localhost:3001/profile/connect/google-fit")}&code=${code}`;
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
    return `client_id=${GoogleFitConfig.ClientID}&client_secret=${GoogleFitConfig.ClientSecret}}&grant_type=refresh_token&refresh_token=${refreshToken}`;
  },
  getStepDataRequestBody: (game: IGame, tracker: StepTracker): any => {
    switch(tracker) {
      case StepTracker.GoogleFit:
        return StepTrackerRequestUtility.getGoogleFitStepDataRequestBody(game);
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
  mapStepsFromResponse: (data: any): number => {
    return 0;
  }
}