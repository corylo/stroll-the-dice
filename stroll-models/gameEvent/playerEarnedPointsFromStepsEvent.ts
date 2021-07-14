import { IGameEvent } from "./gameEvent";

export interface IPlayerEarnedPointsFromStepsEvent extends IGameEvent {
  points: number;
}