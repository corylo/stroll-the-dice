import { UrlUtility } from "./urlUtility";

import { ClientID } from "../../stroll-enums/clientID";
import { StepTracker } from "../../stroll-enums/stepTracker";

interface IStepTrackerUtility {
  determineTrackerFromParam: (match: any) => StepTracker;
  determineTrackerFromString: (value: string) => StepTracker;
  getConnectUrl: (tracker: StepTracker) => string;
  getOAuthUrl: (tracker: StepTracker) => string;
}

export const StepTrackerUtility: IStepTrackerUtility = {
  determineTrackerFromParam: (match: any): StepTracker => {
    const param: string = UrlUtility.getParam(match, "tracker");

    if(param !== "") {
      switch(param) {
        case UrlUtility.format(StepTracker.GoogleFit):        
          return StepTracker.GoogleFit;
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
      default:
        throw new Error(`Unknown step tracker: [${value}]`);
    }    
  },
  getConnectUrl: (tracker: StepTracker): string => {
    return `/profile/connect/${UrlUtility.format(tracker)}`;
  },
  getOAuthUrl: (tracker: StepTracker): string => {
    const redirectUri: string = UrlUtility.encode(UrlUtility.getLink(StepTrackerUtility.getConnectUrl(tracker)));

    switch(tracker) {
      case StepTracker.GoogleFit:     
        const scope: string = UrlUtility.encode("https://www.googleapis.com/auth/fitness.activity.read");

        return `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&prompt=consent&response_type=code&redirect_uri=${redirectUri}&client_id=${ClientID.Google}&access_type=offline`;
      default:
        throw new Error(`Unknown step tracker: ${tracker}`);
    }
  }
}