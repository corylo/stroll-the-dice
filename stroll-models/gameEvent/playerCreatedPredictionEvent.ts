import { IGameEvent } from "./gameEvent";

export interface IPlayerCreatedPredictionEvent extends IGameEvent {
  amount: number;
  playerID: string;
}