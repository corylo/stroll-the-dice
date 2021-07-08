import { FitbitConfig } from "../../../config/fitbitConfig"

interface IStepTrackerUtility {
  getAccessTokenRequestData: (code: string) => string;
  getAccessTokenRequestHeaders: () => any;
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
  }
}