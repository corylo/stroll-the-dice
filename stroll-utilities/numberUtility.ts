interface INumberUtility {
  shorten: (value: number) => string;
  random: (min: number, max: number) => number;
}

export const NumberUtility: INumberUtility = {
  shorten: (value: number): string => {
    if (value < 10000) {
      return value.toLocaleString();
    } else if (value < 100000) {
      return `${(value / 1000).toFixed(2)}K`;
    } else if (value < 1000000) {
      return `${(value / 1000).toFixed(1)}K`;
    } else if (value < 100000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value < 1000000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value < 20000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    } else {
      return "∞";
    }
  },
  random: (min: number, max: number): number => {
    return Math.floor(Math.random() * max) + min;
  }
}