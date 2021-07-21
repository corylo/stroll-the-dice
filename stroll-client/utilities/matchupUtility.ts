import _groupBy from "lodash.groupby";
import _orderBy from "lodash.orderby";

import { IMatchup, IMatchupSide } from "../../stroll-models/matchup";
import { IPlayer } from "../../stroll-models/player";

import { MatchupLeader } from "../../stroll-enums/matchupLeader";

interface IMatchupUtility {  
  calculateOdds: (left: IMatchupSide, right: IMatchupSide) => number;      
  getByPlayer: (playerID: string, matchups: IMatchup[]) => IMatchup;
  getLeader: (matchup: IMatchup) => string;
  getPlayerSteps: (playerID: string, matchup: IMatchup) => number;
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
  getByPlayer: (playerID: string, matchups: IMatchup[]): IMatchup => {
    return matchups.find((matchup: IMatchup) => matchup.left.profile.uid === playerID || matchup.right.profile.uid === playerID);
  },
  getLeader: (matchup: IMatchup): string => {
    let leader: string = MatchupLeader.Tie;

    if(matchup.left.profile.uid !== "" && matchup.right.profile.uid !== "") {
      if(matchup.left.steps > matchup.right.steps) {
        leader = matchup.left.profile.uid;
      } else if (matchup.left.steps < matchup.right.steps) {
        leader = matchup.right.profile.uid;
      }
    }

    return leader;
  },
  getPlayerSteps: (playerID: string, matchup: IMatchup): number => {
    if(playerID === matchup.left.profile.uid) {
      return matchup.left.steps;
    } else if (playerID === matchup.right.profile.uid) {
      return matchup.right.steps;
    }

    throw new Error(`Player [${playerID}] not found in matchup [${matchup.id}]. Left was [${matchup.left.profile.uid}], right was [${matchup.right.profile.uid}]`);
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