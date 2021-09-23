import { EventContext } from "firebase-functions";

interface IScheduleUtility {
  isScheduledGameUpdateWarmupRun: (context: EventContext) => boolean;
}

export const ScheduleUtility: IScheduleUtility = {
  isScheduledGameUpdateWarmupRun: (context: EventContext): boolean => {    
    const date: Date = new Date(context.timestamp),
      minutes: number = date.getMinutes();
      
    return (
      minutes === 56 ||
      minutes === 57 ||
      minutes === 58 ||
      minutes === 59
    )
  }
}