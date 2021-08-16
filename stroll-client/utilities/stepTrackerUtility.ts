import { UrlUtility } from "./urlUtility";

import { FitbitOAuthClientID } from "../../config/fitbitOAuthClientID";
import { GoogleOAuthClientID } from "../../config/googleOAuthClientID";
import { StepTracker } from "../../stroll-enums/stepTracker";

interface IStepTrackerUtility {
  determineTrackerFromParam: (match: any) => StepTracker;
  determineTrackerFromString: (value: string) => StepTracker;
  getConnectUrl: (tracker: StepTracker) => string;
  getLogo: (tracker: StepTracker) => string;
  getOAuthClientID: (tracker: StepTracker) => string;
  getOAuthUrl: (tracker: StepTracker) => string;
  getScope: (tracker: StepTracker) => string;
}

export const StepTrackerUtility: IStepTrackerUtility = {
  determineTrackerFromParam: (match: any): StepTracker => {
    const param: string = UrlUtility.getParam(match, "tracker");

    if(param !== "") {
      switch(param) {
        case UrlUtility.format(StepTracker.GoogleFit):        
          return StepTracker.GoogleFit;
        case UrlUtility.format(StepTracker.Fitbit):        
          return StepTracker.Fitbit;
        default:
          throw new Error(`Unknown step tracker: [${param}]`);
      }    
    }

    return StepTracker.Unknown;
  },
  determineTrackerFromString: (value: string): StepTracker => {
    switch(value) {
      case StepTracker.GoogleFit:        
        return StepTracker.GoogleFit;
      case StepTracker.Fitbit: 
        return StepTracker.Fitbit;
      default:
        throw new Error(`Unknown step tracker: [${value}]`);
    }    
  },
  getConnectUrl: (tracker: StepTracker): string => {
    return `/profile/connect/${UrlUtility.format(tracker)}`;
  },
  getLogo: (tracker: StepTracker): string => {
    switch(tracker) {
      case StepTracker.GoogleFit:
        return "google-fit-logo.png";
      case StepTracker.Fitbit:
        return "fitbit-logo.png";
      default:
        throw new Error(`Unknown step tracker: [${tracker}]`);
    }
  },
  getOAuthClientID: (tracker: StepTracker): string => {
    if(window.location.hostname === "strollthedice.com") {
      switch(tracker) {
        case StepTracker.GoogleFit:     
          return GoogleOAuthClientID.Prod;
        case StepTracker.Fitbit:     
          return FitbitOAuthClientID.Prod;
        default:
          throw new Error(`Unknown step tracker: ${tracker}`);
      }
    } else {
      switch(tracker) {
        case StepTracker.GoogleFit:     
          return GoogleOAuthClientID.Dev;
        case StepTracker.Fitbit:     
          return FitbitOAuthClientID.Prod;
        default:
          throw new Error(`Unknown step tracker: ${tracker}`);
      }
    }
  },
  getOAuthUrl: (tracker: StepTracker): string => {
    const redirectUri: string = UrlUtility.encode(UrlUtility.getLink(StepTrackerUtility.getConnectUrl(tracker))),
      scope: string = StepTrackerUtility.getScope(tracker),
      clientID: string = StepTrackerUtility.getOAuthClientID(tracker);

    switch(tracker) {
      case StepTracker.GoogleFit:
        return `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&response_type=code&redirect_uri=${redirectUri}&client_id=${clientID}&access_type=offline`;      
      case StepTracker.Fitbit: 
        return `https://www.fitbit.com/oauth2/authorize?scope=${scope}&response_type=code&redirect_uri=${redirectUri}&client_id=${clientID}`;      
      default:
        throw new Error(`Unknown step tracker: ${tracker}`);
    }
  },
  getScope: (tracker: StepTracker): string => {
    switch(tracker) {
      case StepTracker.GoogleFit:
        return UrlUtility.encode("https://www.googleapis.com/auth/fitness.activity.read");
      case StepTracker.Fitbit:
        return UrlUtility.encode("activity");
      default:
        throw new Error(`Unknown step tracker: [${tracker}]`);
    }
  }
}