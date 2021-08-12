interface IUrlUtility {
  getOriginUrl: () => string;
}

export const UrlUtility: IUrlUtility = {
  getOriginUrl: (): string => {
    if (process.env.NODE_ENV === "production") {
      return "https://strollthedice.com";
    }
    
    return "https://dev.strollthedice.com";
  }
}