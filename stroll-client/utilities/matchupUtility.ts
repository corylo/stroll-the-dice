import _groupBy from "lodash.groupby";
import _orderBy from "lodash.orderby";

import { IMatchup, IMatchupSide } from "../../stroll-models/matchup";
import { IPlayer } from "../../stroll-models/player";

import { MatchupLeader } from "../../stroll-enums/matchupLeader";

interface IMatchupUtility {  
  calculateOdds: (left: IMatchupSide, right: IMatchupSide) => number;      
  getLeader: (matchup: IMatchup) => string;
  getWinnerOdds: (matchup: IMatchup) => number;
  playerIsInMatchup: (player: IPlayer, matchup: IMatchup) => boolean;
}

export const MatchupUtility: IMatchupUtility = {
  calculateOdds: (left: IMatchupSide, right: IMatchupSide): number => {
    if(left.total.wagered !== 0 && right.total.wagered !== 0) {
      return (left.total.wagered + right.total.wagered) / left.total.wagered;
    }

    return 1;
  },
  getLeader: (matchup: IMatchup): string => {
    let leader: string = MatchupLeader.Tie;

    if(matchup.left.steps > matchup.right.steps) {
      leader = matchup.left.profile.uid;
    } else if (matchup.left.steps < matchup.right.steps) {
      leader = matchup.right.profile.uid;
    }

    return leader;
  },
  getWinnerOdds: (matchup: IMatchup): number => {
    if(matchup.winner !== "" && matchup.winner !== MatchupLeader.Tie) {
      return matchup.winner === matchup.left.profile.uid
        ? MatchupUtility.calculateOdds(matchup.left, matchup.right)
        : MatchupUtility.calculateOdds(matchup.right, matchup.left);
    }

    return 1;
  },
  playerIsInMatchup: (player: IPlayer, matchup: IMatchup): boolean => {
    return (player.id === matchup.left.profile.uid || player.id === matchup.right.profile.uid);
  }
}