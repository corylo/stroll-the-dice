import React from "react";
import classNames from "classnames";
import _orderBy from "lodash.orderby";

import { UserLink } from "../userLink/userLink";

import { IPlayer } from "../../../stroll-models/player";

interface LeaderboardTopRowProps {  
  place: number;
  player: IPlayer;
}

export const LeaderboardTopRow: React.FC<LeaderboardTopRowProps> = (props: LeaderboardTopRowProps) => {      
  const { place, player } = props;

  const icon: string = place === 1 ? "fal fa-trophy-alt" : "fal fa-trophy";

  return (
    <div className={classNames("leaderboard-top-row", "leaderboard-row", `place-${place}`)}>
      <h1 className="leaderboard-top-row-place passion-one-font">{place}</h1>
      <i className={classNames("leaderboard-top-row-icon", icon)} />      
      <div className="leaderboard-row-player-and-funds">
        <UserLink key={player.id} profile={player.profile} />
        <h1 className="leaderboard-row-funds passion-one-font">{player.funds.toLocaleString()}</h1>
      </div>
    </div>
  );
}