import { IMatchup } from "./matchup";

export interface IMatchupGroup {
  day: number;
  matchups: IMatchup[];
}