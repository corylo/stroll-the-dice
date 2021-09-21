import _groupBy from "lodash.groupby";

import { IMatchup, IMatchupSide } from "../../stroll-models/matchup";
import { IPlayer } from "../../stroll-models/player";

import { MatchupLeader } from "../../stroll-enums/matchupLeader";

interface IMatchupUtility {  
  calculateRatio: (left: IMatchupSide, right: IMatchupSide) => number;      
  getByPlayer: (playerID: string, matchups: IMatchup[]) => IMatchup;
  getLeader: (matchup: IMatchup) => string;
  getPlayerSteps: (playerID: string, matchup: IMatchup) => number;
  getSideByFavorite: (matchup: IMatchup, shouldGetFavorite: boolean) => IMatchupSide;
  getWinnerRatio: (matchup: IMatchup) => number;
  mapProfilesToMatchup: (matchup: IMatchup, players: IPlayer[]) => IMatchup;
  mapProfilesToMatchups: (matchups: IMatchup[], players: IPlayer[]) => IMatchup[];
  playerIsInMatchup: (player: IPlayer, matchup: IMatchup) => boolean;
}

export const MatchupUtility: IMatchupUtility = {
  calculateRatio: (left: IMatchupSide, right: IMatchupSide): number => {
    if(left.total.wagered !== 0 && right.total.wagered !== 0) {
      return (left.total.wagered + right.total.wagered) / left.total.wagered;
    }

    return 1;
  },
  getByPlayer: (playerID: string, matchups: IMatchup[]): IMatchup => {
    return matchups.find((matchup: IMatchup) => matchup.left.playerID === playerID || matchup.right.playerID === playerID);
  },
  getLeader: (matchup: IMatchup): string => {
    let leader: string = MatchupLeader.Tie;

    if(matchup.left.playerID !== "" && matchup.right.playerID !== "") {
      if(matchup.left.steps > matchup.right.steps) {
        leader = matchup.left.playerID;
      } else if (matchup.left.steps < matchup.right.steps) {
        leader = matchup.right.playerID;
      }
    }

    return leader;
  },
  getPlayerSteps: (playerID: string, matchup: IMatchup): number => {
    if(playerID === matchup.left.playerID) {
      return matchup.left.steps;
    } else if (playerID === matchup.right.playerID) {
      return matchup.right.steps;
    }

    throw new Error(`Player [${playerID}] not found in matchup [${matchup.id}]. Left was [${matchup.left.playerID}], right was [${matchup.right.playerID}]`);
  },
  getSideByFavorite: (matchup: IMatchup, shouldGetFavorite: boolean): IMatchupSide => {
    if(shouldGetFavorite) {
      if(matchup.left.playerID === matchup.favoriteID) {
        return matchup.left;
      } else if (matchup.right.playerID === matchup.favoriteID) {
        return matchup.right;
      }
    }
    
    if(matchup.left.playerID !== matchup.favoriteID) {
      return matchup.left;
    } else if (matchup.right.playerID !== matchup.favoriteID) {
      return matchup.right;
    }
  },
  getWinnerRatio: (matchup: IMatchup): number => {
    if(matchup.winner !== "" && matchup.winner !== MatchupLeader.Tie) {
      return matchup.winner === matchup.left.playerID
        ? MatchupUtility.calculateRatio(matchup.left, matchup.right)
        : MatchupUtility.calculateRatio(matchup.right, matchup.left);
    }

    return 1;
  },
  mapProfilesToMatchup: (matchup: IMatchup, players: IPlayer[]): IMatchup => {
    if(matchup.left.playerID !== "") {
      const player: IPlayer = players.find((player: IPlayer) => player.id === matchup.left.playerID);

      if(player) {
        matchup.left.profile = player.profile;
      }
    }
    
    if(matchup.right.playerID !== "") {
      const player: IPlayer = players.find((player: IPlayer) => player.id === matchup.right.playerID);

      if(player) {
        matchup.right.profile = player.profile;
      }
    }

    return matchup;
  },
  mapProfilesToMatchups: (matchups: IMatchup[], players: IPlayer[]): IMatchup[] => {
    return matchups.map((matchup: IMatchup) => MatchupUtility.mapProfilesToMatchup(matchup, players));
  },
  playerIsInMatchup: (player: IPlayer, matchup: IMatchup): boolean => {
    return (player.id === matchup.left.playerID || player.id === matchup.right.playerID);
  }
}