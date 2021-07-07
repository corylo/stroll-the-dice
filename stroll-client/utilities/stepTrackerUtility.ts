import { UrlUtility } from "./urlUtility";

import { StepTracker } from "../../stroll-enums/stepTracker";

interface IStepTrackerUtility {
  determineTrackerFromParam: (match: any) => StepTracker;
  determineTrackerFromString: (value: string) => StepTracker;
  getConnectUrl: (tracker: StepTracker) => string;
  getUrl: (tracker: StepTracker) => string;
}

export const StepTrackerUtility: IStepTrackerUtility = {
  determineTrackerFromParam: (match: any): StepTracker => {
    const param: string = UrlUtility.getParam(match, "tracker");

    if(param !== "") {
      switch(param) {
        case UrlUtility.format(StepTracker.Fitbit):        
          return StepTracker.Fitbit;
        default:
          throw new Error(`Step tracker [${param}] is not valid.`);
      }    
    }

    return StepTracker.Unknown;
  },
  determineTrackerFromString: (value: string): StepTracker => {
    switch(value) {
      case StepTracker.Fitbit:        
        return StepTracker.Fitbit;
      default:
        throw new Error(`Step tracker [${value}] is not valid.`);
    }    
  },
  getConnectUrl: (tracker: StepTracker): string => {
    return `/profile/connect/${UrlUtility.format(tracker)}`;
  },
  getUrl: (tracker: StepTracker): string => {
    const redirectUri: string = UrlUtility.encode(UrlUtility.getLink(StepTrackerUtility.getConnectUrl(tracker)));

    switch(tracker) {
      case StepTracker.Fitbit:        
        return `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23BB2H&redirect_uri=${redirectUri}&scope=activity&expires_in=604800`;
      default:
        throw new Error(`Unknown step tracker: ${tracker}`);
    }
  }
}