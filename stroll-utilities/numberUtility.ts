interface INumberUtility {
  format: (value: number, divisor: number, maxSig?: number) => string;
  shorten: (value: number) => string;
  random: (min: number, max: number) => number;
}

export const NumberUtility: INumberUtility = {
  format: (value: number, divisor: number, maxSig?: number): string => {
    return new Intl.NumberFormat("en-IN", { maximumSignificantDigits: maxSig || 4 }).format(value / divisor);
  },
  shorten: (value: number): string => {
    if (value < 10000) {
      return value.toLocaleString();
    } else if (value < 100000) {
      return `${NumberUtility.format(value, 1000)}K`;      
    } else if (value < 1000000) {
      return `${NumberUtility.format(value, 1000, 4)}K`;    
    } else if (value < 10000000) {
      return `${NumberUtility.format(value, 1000000, 3)}M`;    
    } else if (value < 100000000) {
      return `${NumberUtility.format(value, 1000000, 4)}M`;  
    } else if (value < 1000000000) {
      return `${NumberUtility.format(value, 1000000, 4)}M`;  
    } else if (value < 20000000000) {
      return `${NumberUtility.format(value, 1000000000, 3)}B`; 
    } else {
      return "∞";
    }
  },
  random: (min: number, max: number): number => {
    return Math.floor(Math.random() * max) + min;
  }
}