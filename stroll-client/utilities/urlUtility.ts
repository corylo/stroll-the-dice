interface IUrlUtility {
  format: (value: string) => string;
  getLink: (path: string) => string;
  getParam: (match: any, param: string) => string;
}

export const UrlUtility: IUrlUtility = {
  format: (value: string): string => {
    return value.replace(/\s+/g, '-').toLowerCase();
  },
  getLink: (path: string): string => {
    return `${window.location.origin}${path}`;
  },
  getParam: (match: any, param: string): string => {
    if(match && match.params && match.params[param]) {
      return match.params[param];
    }

    return "";
  }
}