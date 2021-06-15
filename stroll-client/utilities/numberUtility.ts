interface INumberUtility {
  likes: (count: number) => string;
  random: (min: number, max: number) => number;
}

export const NumberUtility: INumberUtility = {
  likes: (count: number): string => {
    if (count < 1000) {
      return count.toString();
    } else if (count < 20000) {
      return `${(count / 1000).toFixed(1)}K`;
    } else if (count < 1000000) {
      return `${Math.round(count / 1000)}K`;
    } else if (count < 20000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count < 1000000000) {
      return `${Math.round(count / 1000000)}M`;
    } else if (count < 20000000000) {
      return `${(count / 1000000000).toFixed(1)}B`;
    } else {
      return "∞";
    }
  },
  random: (min: number, max: number): number => {
    return Math.floor(Math.random() * max) + min;
  }
}