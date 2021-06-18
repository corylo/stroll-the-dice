interface IDateUtility {
  dateToInput: (date: Date) => string;
  daysToMillis: (days: number) => number;  
  secondsToRelative: (seconds: number) => string;  
  valid: (value: string) => boolean;
  withinBoundaries: (value: string) => boolean;
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
  secondsToRelative: (seconds: number): string => {
    const relativeMillis: number = Math.abs(
        seconds * 1000 - new Date().getTime()
      ),
      relativeSeconds: number = Math.round(relativeMillis / 1000);
 
    if (relativeSeconds < 5) {
      return "Now";
    }

    if (relativeSeconds < 60) {
      return `${relativeSeconds}s`;
    }

    const relativeMinutes: number = Math.floor(relativeSeconds / 60);

    if (relativeMinutes < 60) {
      return `${relativeMinutes}m`;
    }

    const relativeHours: number = Math.floor(relativeMinutes / 60);

    if (relativeHours < 24) {
      return `${relativeHours}h`;
    }

    const relativeDays: number = Math.floor(relativeHours / 24);

    if (relativeDays < 7) {
      return `${relativeDays}d`;
    }

    const relativeWeeks: number = Math.floor(relativeDays / 7);

    if (relativeWeeks < 4) {
      return `${relativeWeeks}w`;
    }

    const relativeMonths: number = Math.floor(relativeDays / 30.41666);

    if (relativeMonths < 12) {
      return `${relativeMonths}M`;
    }

    const relativeYears: number = Math.floor(relativeDays / 365);

    return `${relativeYears}y`;
  },
  valid: (value: string): boolean => {
    const date: Date = new Date(value);

    return !isNaN(date.valueOf());
  },
  withinBoundaries: (value: string): boolean => {
    const current: Date = new Date(),
      date: Date = new Date(value);

    const diff: number = Math.abs(current.getTime() - date.getTime()),
      days: number = diff / (1000 * 60 * 60 * 24);
      
    return days <= 30;
  }
};
