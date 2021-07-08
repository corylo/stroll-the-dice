import { FitbitConfig } from "../../../config/fitbitConfig"

interface IStepTrackerUtility {
  getAccessTokenRequestData: (code: string) => string;
  getAccessTokenRequestHeaders: () => any;
  getOAuthUrl: () => string;
  getStepDataRequestHeaders: (accessToken: string) => any;
  getStepDataUrl: (playerID: string) => string;
  mapStepsFromResponse: (data: any, yesterday?: boolean) => number;
}

export const StepTrackerUtility: IStepTrackerUtility = {
  getAccessTokenRequestData: (code: string): string => {
    return `clientId=${FitbitConfig.ClientID}&grant_type=authorization_code&redirect_uri=${encodeURIComponent("http://localhost:3001/profile/connect/fitbit")}&code=${code}`;
  },
  getAccessTokenRequestHeaders: (): any => {
    const token: string = Buffer.from(`${FitbitConfig.ClientID}:${FitbitConfig.ClientSecret}`).toString("base64");

    return {
      headers: {
        "Authorization": `Basic ${token}`,
        "Content-Type": "application/x-www-form-urlencoded" 
      }
    }
  },
  getOAuthUrl: (): string => {
    return "https://api.fitbit.com/oauth2/token";
  },
  getStepDataRequestHeaders: (accessToken: string): any => {
    return {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }
  },
  getStepDataUrl: (playerID: string): string => {
    return `https://api.fitbit.com/1/user/${playerID}/activities/steps/date/today/1w.json`;
  },
  mapStepsFromResponse: (data: any, yesterday?: boolean): number => {
    const counts: any[] = data["activities-steps"];

    if(counts.length === 7) {
      return yesterday
        ? counts[counts.length - 2].value
        : counts[counts.length - 1].value;
    }

    return 0;
  }
}