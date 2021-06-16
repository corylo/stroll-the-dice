import firebase from "firebase/app";

interface IDateUtility {
  daysToMillis: (days: number) => number;
  formatRelative: (seconds: number) => string;
  stringToFirestoreTimestamp: (date: string) => firebase.firestore.Timestamp;
}

export const DateUtility: IDateUtility = {
  daysToMillis: (days: number): number => {
    return days * 24 * 3600 * 1000;
  },
  formatRelative: (seconds: number): string => {
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
  stringToFirestoreTimestamp: (date: string): firebase.firestore.Timestamp => {
    return firebase.firestore.Timestamp.fromDate(new Date(date));
  }
};
