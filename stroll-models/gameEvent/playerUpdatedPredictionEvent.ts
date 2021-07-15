import { IGameEvent } from "./gameEvent";

export interface IPlayerUpdatedPredictionEvent extends IGameEvent {
  afterAmount: number;
  beforeAmount: number;
  matchupID: string;
  playerID: string;
}