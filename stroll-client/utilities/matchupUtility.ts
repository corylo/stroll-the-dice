import { IMatchup, IMatchupSide } from "../../stroll-models/matchup";
import { IPlayer } from "../../stroll-models/player";

import { PlayerUtility } from "./playerUtility";

interface IMatchupUtility {  
  calculateOdds: (left: IMatchupSide, right: IMatchupSide) => number;
  mapPlayers: (matchups: IMatchup[], players: IPlayer[]) => IMatchup[];
  mapPlayerToSide: (side: IMatchupSide, players: IPlayer[]) => IMatchupSide;
}

export const MatchupUtility: IMatchupUtility = {
  calculateOdds: (left: IMatchupSide, right: IMatchupSide): number => {
    return 1;
  },
  mapPlayers: (matchups: IMatchup[], players: IPlayer[]): IMatchup[] => {
    return matchups.map((matchup: IMatchup) => {
      return {
        ...matchup,
        left: MatchupUtility.mapPlayerToSide(matchup.left, players),
        right: MatchupUtility.mapPlayerToSide(matchup.right, players)
      }
    });
  },
  mapPlayerToSide: (side: IMatchupSide, players: IPlayer[]): IMatchupSide => {
    if(side.ref !== "") {
      return {
        ...side,
        player: PlayerUtility.getById(side.ref, players)
      }
    }

    return side;
  }
}