import { IGameEvent } from "./gameEvent";

export interface IPlayerCreatedPredictionEvent extends IGameEvent {
  amount: number;
  matchupID: string;
  playerID: string;
}