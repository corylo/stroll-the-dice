import { IGameEvent } from "./gameEvent";

export interface IPlayerDayCompletedSummaryEvent extends IGameEvent {
  day: number;
  points: number;
  steps: number;
}