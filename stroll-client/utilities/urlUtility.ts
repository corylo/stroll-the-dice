interface IUrlUtility {
  format: (value: string) => string;
  getParam: (match: any, param: string) => string;
}

export const UrlUtility: IUrlUtility = {
  format: (value: string): string => {
    return value.replace(/\s+/g, '-').toLowerCase();
  },
  getParam: (match: any, param: string): string => {
    if(match && match.params && match.params[param]) {
      return match.params[param];
    }

    return "";
  }
}