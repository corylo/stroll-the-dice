import { config } from "firebase-functions";

interface IUrlUtility {
  getOriginUrl: () => string;
}

export const UrlUtility: IUrlUtility = {
  getOriginUrl: (): string => {
    if (config().env.value === "production") {
      return "https://strollthedice.com";
    }
    
    return "https://dev.strollthedice.com";
  }
}