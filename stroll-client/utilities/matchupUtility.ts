import _groupBy from "lodash.groupby";
import _orderBy from "lodash.orderby";

import { PlayerUtility } from "./playerUtility";

import { IMatchup, IMatchupSide } from "../../stroll-models/matchup";
import { IMatchupGroup } from "../../stroll-models/matchupGroup";
import { IPlayer } from "../../stroll-models/player";

interface IMatchupUtility {  
  calculateOdds: (left: IMatchupSide, right: IMatchupSide) => number;    
  findPlayer: (player: IPlayer, matchup: IMatchup) => boolean;
  groupByDay: (matchups: IMatchup[]) => IMatchupGroup[];
  mapPlayers: (matchups: IMatchup[], players: IPlayer[]) => IMatchup[];
  mapPlayerToSide: (side: IMatchupSide, players: IPlayer[]) => IMatchupSide;  
}

export const MatchupUtility: IMatchupUtility = {
  calculateOdds: (left: IMatchupSide, right: IMatchupSide): number => {
    if(left.total.wagered !== 0 && right.total.wagered !== 0) {
      return parseFloat(((left.total.wagered + right.total.wagered) / left.total.wagered).toFixed(2));
    }

    return 1;
  },
  findPlayer: (player: IPlayer, matchup: IMatchup): boolean => {
    return (player.id === matchup.left.ref || player.id === matchup.right.ref);
  },
  groupByDay: (matchups: IMatchup[]): IMatchupGroup[] => {
    return _orderBy(Object.entries(_groupBy(matchups, "day"))
      .map((entry: any) => ({ day: parseInt(entry[0]), matchups: entry[1] })), "day", "desc");      
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