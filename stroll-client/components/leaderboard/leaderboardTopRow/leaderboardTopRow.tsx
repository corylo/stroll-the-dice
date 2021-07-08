import React from "react";
import classNames from "classnames";
import _orderBy from "lodash.orderby";

import { Label } from "../../label/label";
import { ProfileIcon } from "../../profileIcon/profileIcon";

import { IPlayer } from "../../../../stroll-models/player";

interface LeaderboardTopRowProps {  
  place: number;
  player: IPlayer;
}

export const LeaderboardTopRow: React.FC<LeaderboardTopRowProps> = (props: LeaderboardTopRowProps) => {      
  const { points, profile } = props.player;

  const getPlace = (): string => {
    if(props.place === 1) {
      return "1st";
    } else if(props.place === 2) {
      return "2nd";
    } else if(props.place === 3) {
      return "3rd";
    }
  }

  return (
    <div className={classNames("leaderboard-top-row", `place-${props.place}`)}>
      <div className="leaderboard-top-row-player">        
        <h1 className="leaderboard-top-row-place passion-one-font">{getPlace()}</h1>
        <div className="leaderboard-top-row-player-icon">
          <ProfileIcon 
            color={profile.color}
            icon={profile.icon}
          />
          <i className="leaderboard-top-row-icon fal fa-trophy-alt" />      
        </div>
        <h1 
          className="leaderboard-top-row-player-username passion-one-font" 
          style={{ color: `rgb(${profile.color})` }}
          title={profile.username}
        >
          {profile.username}
        </h1>     
      </div>            
      <Label
        className="leaderboard-top-row-points passion-one-font"
        icon="fal fa-coins" 
        text={points.total.toLocaleString()} 
      />
    </div>
  );
}