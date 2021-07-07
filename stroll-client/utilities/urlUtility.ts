interface IUrlUtility {
  clearParam: (history: any, param: string) => void;
  encode: (value: string) => string;
  format: (value: string) => string;
  getLink: (path: string) => string;
  getParam: (match: any, param: string) => string;
  getQueryParam: (param: string) => string;
}

export const UrlUtility: IUrlUtility = {
  clearParam: (history: any, param: string): void => {
    const value: string = UrlUtility.getQueryParam(param);

    if(value !== null) {
      history.replace(window.location.pathname);
    }
  },
  encode: (value: string): string => {
    return encodeURI(value);
  },
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
  },
  getQueryParam: (param: string): string => {
    const params: URLSearchParams = new URLSearchParams(window.location.search),
      value: string | null = params.get(param);

    return value;
  }
}