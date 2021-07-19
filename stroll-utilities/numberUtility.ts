interface INumberUtility {
  shorten: (value: number) => string;
  random: (min: number, max: number) => number;
}

export const NumberUtility: INumberUtility = {
  shorten: (value: number): string => {
    if (value < 10000) {
      return value.toLocaleString();
    } else if (value < 100000) {
      return `${Math.floor(value / 100) / 10}K`;
    } else if (value < 1000000) {
      return `${Math.floor(value / 1000)}K`;
    } else if (value < 100000000) {
      return `${Math.floor(value / 100000) / 10}M`;
    } else if (value < 1000000000) {
      return `${Math.floor(value / 1000000)}M`;
    } else if (value < 20000000000) {
      return `${Math.floor(value / 100000000) / 10}B`;
    } else {
      return "∞";
    }
  },
  random: (min: number, max: number): number => {
    return Math.floor(Math.random() * max) + min;
  }
}