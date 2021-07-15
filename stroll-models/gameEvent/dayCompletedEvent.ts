import { IGameEvent } from "./gameEvent";

export interface IDayCompletedEvent extends IGameEvent {
  day: number;
}