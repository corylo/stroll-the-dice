import { IGameEvent } from "./gameEvent";
import { IMatchupProfileReference } from "../matchupProfileReference";

export interface IPlayerUpdatedPredictionEvent extends IGameEvent {
  afterAmount: number;
  beforeAmount: number;
  matchup: IMatchupProfileReference;
  playerID: string;
}