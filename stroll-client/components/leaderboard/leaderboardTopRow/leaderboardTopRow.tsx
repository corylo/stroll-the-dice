import React from "react";
import classNames from "classnames";

import { AnimatedCounter } from "../../animatedCounter/animatedCounter";
import { LeaderboardTopRowPillar } from "./leaderboardTopRowPillar";
import { LeaderboardTopRowPlayer } from "./leaderboardTopRowPlayer";

import { IPlayer } from "../../../../stroll-models/player";

import { Icon } from "../../../../stroll-enums/icon";

interface LeaderboardTopRowProps {  
  place: number;
  player: IPlayer;
}

export const LeaderboardTopRow: React.FC<LeaderboardTopRowProps> = (props: LeaderboardTopRowProps) => {      
  const { points } = props.player;

  return (
    <div className={classNames("leaderboard-top-row", `place-${props.place}`)}>
      <div className="leaderboard-top-row-content">
        <LeaderboardTopRowPlayer place={props.place} player={props.player} />
        <div className="leaderboard-top-row-points">
          <i className={Icon.Points} />                 
          <AnimatedCounter 
            initialValue={points.total}
            value={points.total} 
            formatValue={(value: number) => value.toLocaleString()} 
          />
        </div>  
        <LeaderboardTopRowPillar />
      </div>
    </div>
  );
}