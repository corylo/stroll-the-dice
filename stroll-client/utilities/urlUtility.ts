interface IUrlUtility {
  format: (value: string) => string;
}

export const UrlUtility: IUrlUtility = {
  format: (value: string): string => {
    return value.replace(/\s+/g, '-').toLowerCase();
  }
}