import { IGameEvent } from "./gameEvent";
import { IMatchupPlayerReference } from "../matchupProfileReference";

export interface IPlayerUpdatedPredictionEvent extends IGameEvent {
  afterAmount: number;
  beforeAmount: number;
  matchup: IMatchupPlayerReference;
  playerID: string;
}