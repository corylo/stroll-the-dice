import React from "react";
import _orderBy from "lodash.orderby";

import { UserLink } from "../../userLink/userLink";

import { IPlayer } from "../../../../stroll-models/player";

interface LeaderboardRowProps {  
  place: number;
  player: IPlayer;
}

export const LeaderboardRow: React.FC<LeaderboardRowProps> = (props: LeaderboardRowProps) => {      
  const { place, player } = props;

  return (
    <div className="leaderboard-remaining-row leaderboard-row">
      <h1 className="leaderboard-row-place passion-one-font">{place}</h1>
      <i className="leaderboard-row-icon fal fa-trophy" />      
      <div className="leaderboard-row-player-and-funds">
        <UserLink key={player.id} profile={player.profile} />
        <h1 className="leaderboard-row-funds passion-one-font">{player.funds.toLocaleString()}</h1>
      </div>
    </div>
  );
}