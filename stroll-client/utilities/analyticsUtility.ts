import { analytics } from "../config/firebase";

interface IAnalyticsUtility {
  log: (event: string, params?: any) => void;
}

export const AnalyticsUtility: IAnalyticsUtility = {
  log: (event: string, params?: any): void => {
    if(params) {
      analytics.logEvent(event, params);
    } else {
      analytics.logEvent(event);
    }
  }
}