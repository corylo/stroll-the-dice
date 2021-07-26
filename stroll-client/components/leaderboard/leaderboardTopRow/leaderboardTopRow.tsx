import React from "react";
import classNames from "classnames";
import _orderBy from "lodash.orderby";

import { AnimatedCounter } from "../../animatedCounter/animatedCounter";
import { ProfileIcon } from "../../profileIcon/profileIcon";

import { IPlayer } from "../../../../stroll-models/player";

import { Icon } from "../../../../stroll-enums/icon";

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

  const getName = (): JSX.Element => {
    if(profile.name) {
      return (        
        <h1 className="leaderboard-top-row-player-name passion-one-font">
          {profile.name}
        </h1>  
      )
    }
  }
  
  return (
    <div className={classNames("leaderboard-top-row", `place-${props.place}`)}>
      <div className="leaderboard-top-row-content-border" />
      <div className="leaderboard-top-row-content">
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
          {getName()}
        </div>             
        <div className="leaderboard-top-row-points">
          <i className={Icon.Points} />                 
          <AnimatedCounter 
            value={points.total} 
            formatValue={(value: number) => value.toLocaleString()} 
          />
        </div>  
      </div>
    </div>
  );
}