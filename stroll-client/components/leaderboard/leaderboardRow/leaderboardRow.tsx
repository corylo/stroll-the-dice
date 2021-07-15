import React from "react";
import _orderBy from "lodash.orderby";

import { Label } from "../../label/label";
import { UserLink } from "../../userLink/userLink";

import { IPlayer } from "../../../../stroll-models/player";

import { Icon } from "../../../../stroll-enums/icon";

interface LeaderboardRowProps {  
  place: number;
  player: IPlayer;
}

export const LeaderboardRow: React.FC<LeaderboardRowProps> = (props: LeaderboardRowProps) => {      
  const { place, player } = props;

  return (
    <div className="leaderboard-remaining-row leaderboard-row">
      <div className="leaderboard-remaining-row-border" />
      <div className="leaderboard-remaining-row-content">
        <h1 className="leaderboard-row-place passion-one-font">{place}</h1>
        <i className="leaderboard-row-icon fal fa-trophy" />      
        <div className="leaderboard-row-player-and-points">
          <UserLink key={player.id} profile={player.profile} />          
          <Label
            className="leaderboard-row-points passion-one-font"
            icon={Icon.Points} 
            text={player.points.total.toLocaleString()} 
          />
        </div>
      </div>
    </div>
  );
}