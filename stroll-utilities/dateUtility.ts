interface IDateUtility {
  dateToInput: (date: Date) => string;
  daysToMillis: (days: number) => number;  
  diffInDays: (value: string, hour?: number) => number;
  getRelativeOfUnit: (seconds: number, unit: "H" | "M" | "S") => number;
  getTimeUntilMinuteOfHour: (interval: number) => string;
  getTomorrow: () => Date;
  lessThanOrEqualToNow: (seconds: number) => boolean;
  secondsToRelative: (seconds: number) => string;  
  stringToOffsetDate: (value: string, hour?: number) => Date;
  valid: (value: string) => boolean;  
  withinDaysLower: (limit: number, value: string, hour?: number) => boolean;
  withinDaysUpper: (limit: number, value: string) => boolean;
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
  diffInDays: (value: string, hour?: number): number => {
    const current: Date = new Date(),
      date: Date = DateUtility.stringToOffsetDate(value);

    if(hour) {
      date.setHours(hour);
    }

    const diff: number = date.getTime() - current.getTime();
    
    return diff / (24 * 3600 * 1000);
  },
  getRelativeOfUnit: (seconds: number, unit: "H" | "M" | "S"): number => {     
    const relativeMillis: number = Math.abs(seconds * 1000 - new Date().getTime()),
      relativeSeconds: number = Math.round(relativeMillis / 1000),
      relativeMinutes: number = Math.floor(relativeSeconds / 60),
      relativeHours: number = Math.floor(relativeMinutes / 60);

    switch(unit) {
      case "S":
        return relativeSeconds;
      case "M":
        return relativeMinutes;
      case "H":
        return relativeHours;
      default:
        return null;
    }
  },
  getTimeUntilMinuteOfHour: (interval: number): string => {
    const date: Date = new Date();

    date.setMinutes(interval);
    date.setSeconds(0);

    if(Date.now() < date.getTime()) {
      return DateUtility.secondsToRelative(date.getTime() / 1000);
    }

    date.setHours(date.getHours() + 1);
    date.setMinutes(0);

    return DateUtility.secondsToRelative(date.getTime() / 1000);
  },
  getTomorrow: (): Date => {
    const date: Date = new Date();

    date.setDate(date.getDate() + 1);

    return date;
  },
  lessThanOrEqualToNow: (seconds: number): boolean => {  
    return (seconds * 1000) <= Date.now();
  },
  secondsToRelative: (seconds: number): string => {        
    const relativeMillis: number = seconds * 1000 - new Date().getTime(),
      relativeSeconds: number = Math.round(relativeMillis / 1000);
          
    if (relativeSeconds < 60) {
      return `${relativeSeconds}s`;
    }

    const relativeMinutes: number = Math.ceil(relativeSeconds / 60);

    if (relativeMinutes < 60) {
      return `${relativeMinutes}m`;
    }

    const relativeHours: number = Math.floor(relativeMinutes / 60);

    if (relativeHours < 24) {
      const minutes: number = relativeMinutes - (relativeHours * 60),
        minuteClause: string = minutes > 0 ? ` ${minutes}m` : ""

      return `${relativeHours}h${minuteClause}`;
    }

    const relativeDays: number = Math.floor(relativeHours / 24);

    const hours: number = relativeHours - (relativeDays * 24),
      hourClause: string = hours > 0 ? ` ${hours}h` : "";


    return `${relativeDays}d${hourClause}`;
  },
  stringToOffsetDate: (value: string, hour?: number): Date => {
    const date: Date = new Date(value);

    date.setTime(date.getTime() + date.getTimezoneOffset() * 60000);

    if(hour) {
      date.setHours(hour);
    }

    return date;
  },
  valid: (value: string): boolean => {
    const date: Date = new Date(value);

    return !isNaN(date.valueOf());
  },
  withinDaysLower: (limit: number, value: string, hour?: number): boolean => {
    return DateUtility.diffInDays(value, hour) >= limit;
  },
  withinDaysUpper: (limit: number, value: string): boolean => {
    return DateUtility.diffInDays(value) <= limit;
  },
};
