import React from "react";
import _orderBy from "lodash.orderby";

import { LeaderboardRow } from "./leaderboardRow/leaderboardRow";
import { LeaderboardTopRow } from "./leaderboardTopRow/leaderboardTopRow";

import { IPlayer } from "../../../stroll-models/player";

export enum LeaderboardSort {
  Alphabetical = "Alphabetical",
  Funds = "Funds",
  Steps = "Steps"
}

interface LeaderboardProps {  
  players: IPlayer[];
  sort: LeaderboardSort;
}

export const Leaderboard: React.FC<LeaderboardProps> = (props: LeaderboardProps) => {    
  const getRows = (): JSX.Element => {
    if(props.sort === LeaderboardSort.Alphabetical) {
      const players: IPlayer[] = _orderBy(props.players, (player: IPlayer) => player.profile.username.toLowerCase(), "desc");

      return getRemainingRows(players);
    } else {
      const players: IPlayer[] = _orderBy(props.players, ["funds", (player: IPlayer) => player.profile.username.toLowerCase()], ["desc", "asc"]);
      
      const remainingRows: JSX.Element = players.length > 3
        ? getRemainingRows(players.slice(3), 4)
        : null;

      return (
        <React.Fragment>
          {getTopRows(players.slice(0, 3))}
          {remainingRows}
        </React.Fragment>
      )
    }
  }

  const getTopRows = (players: IPlayer[]): JSX.Element => {
    const first: IPlayer = players[0],
      second: IPlayer = players[1],
      third: IPlayer = players[2];
    
    return (
      <div className="leaderboard-top-rows">
        <LeaderboardTopRow place={2} player={second} />
        <LeaderboardTopRow place={1} player={first} />
        <LeaderboardTopRow place={3} player={third} />
      </div>
    )
  }

  const getRemainingRows = (players: IPlayer[], start?: number): JSX.Element => {
    const rows: JSX.Element[] = players.map((player: IPlayer, index: number) =>
      <LeaderboardRow key={player.id} place={index + (start || 1)} player={player} />
    );

    return (
      <div className="leaderboard-remaining-rows">
        {rows}
      </div>
    )
  }

  return (
    <div className="leaderboard">
      {getRows()}
    </div>
  );
}