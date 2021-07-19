import { IGameEvent } from "./gameEvent";

export interface IPlayerDayCompletedSummaryEvent extends IGameEvent {
  day: number;
  gained: number;
  lost: number;
  overall: number;  
  received: number;
  steps: number;  
  wagered: number;
}