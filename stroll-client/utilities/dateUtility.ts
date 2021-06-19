interface IDateUtility {
  dateToInput: (date: Date) => string;
  daysToMillis: (days: number) => number;  
  diffInDays: (value: string) => number;
  getTomorrow: () => Date;
  inPast: (seconds: number) => boolean;
  secondsToLocale: (seconds: number) => string;
  secondsToRelative: (seconds: number) => string;  
  valid: (value: string) => boolean;  
  withinDaysLower: (value: string, limit: number) => boolean;
  withinDaysUpper: (value: string, limit: number) => boolean;
}

export const DateUtility: IDateUtility = {
  dateToInput: (date: Date): string => {
    var month: string = (date.getMonth() + 1).toString(),
        day: string = date.getDate().toString(),
        year: string = date.getFullYear().toString();

    if(month.length < 2) {
      month = `0${month}`;
    }
    
    if(day.length < 2) {
      day = `0${day}`;
    }

    return [year, month, day].join("-");
  },
  daysToMillis: (days: number): number => {
    return days * 24 * 3600 * 1000;
  },
  diffInDays: (value: string): number => {
    const current: Date = new Date(),
      date: Date = new Date(value);

    const diff: number = date.getTime() - current.getTime();
    
    return diff / (24 * 3600 * 1000);
  },
  getTomorrow: (): Date => {
    const date: Date = new Date();

    date.setDate(date.getDate() + 1);

    return date;
  },
  inPast: (seconds: number): boolean => {    
    return (seconds * 1000) < Date.now();
  },
  secondsToLocale: (seconds: number): string => {
    const date: Date = new Date(seconds * 1000);

    return date.toDateString();
  },
  secondsToRelative: (seconds: number): string => {
    const relativeMillis: number = Math.abs(
        seconds * 1000 - new Date().getTime()
      ),
      relativeSeconds: number = Math.round(relativeMillis / 1000);
      
    if (relativeSeconds < 60) {
      return `${relativeSeconds}s`;
    }

    const relativeMinutes: number = Math.floor(relativeSeconds / 60);

    if (relativeMinutes < 60) {
      return `${relativeMinutes}m`;
    }

    const relativeHours: number = Math.floor(relativeMinutes / 60);

    if (relativeHours < 24) {
      return `${relativeHours}h ${relativeMinutes - (relativeHours * 60)}m`;
    }

    const relativeDays: number = Math.floor(relativeHours / 24);

    return `${relativeDays}d ${relativeHours - (relativeDays * 24)}h`;
  },
  valid: (value: string): boolean => {
    const date: Date = new Date(value);

    return !isNaN(date.valueOf());
  },
  withinDaysLower: (value: string, limit: number): boolean => {
    return DateUtility.diffInDays(value) >= limit;
  },
  withinDaysUpper: (value: string, limit: number): boolean => {
    return DateUtility.diffInDays(value) <= limit;
  },
};
