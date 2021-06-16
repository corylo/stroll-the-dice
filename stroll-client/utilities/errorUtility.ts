interface IErrorUtility {
  doesNotExist: (type: string) => string;
}

export const ErrorUtility: IErrorUtility = {
  doesNotExist: (type: string): string => {
    return `Whoops! It looks like this ${type} does not exist.`;
  }
}