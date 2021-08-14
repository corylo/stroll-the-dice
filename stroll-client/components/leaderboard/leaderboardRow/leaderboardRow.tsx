import React from "react";
import _orderBy from "lodash.orderby";

import { AnimatedCounter } from "../../animatedCounter/animatedCounter";
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
        <div className="leaderboard-row-player-and-points">
          <UserLink key={player.id} profile={player.profile} />          
          <div className="leaderboard-row-points">
            <i className={Icon.Points} />                 
            <AnimatedCounter 
              initialValue={player.points.total} 
              value={player.points.total} 
              formatValue={(value: number) => value.toLocaleString()} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}