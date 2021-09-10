import React from "react";

import { LeaderboardTopRowPillar } from "./leaderboardTopRowPillar";
import { PlayerLevelBadge } from "../../playerLevelBadge/playerLevelBadge";
import { ProfileIcon } from "../../profileIcon/profileIcon";

import { IPlayer } from "../../../../stroll-models/player";

interface LeaderboardTopRowPlayerProps {  
  place: number;
  player: IPlayer;
}

export const LeaderboardTopRowPlayer: React.FC<LeaderboardTopRowPlayerProps> = (props: LeaderboardTopRowPlayerProps) => {      
  const { profile } = props.player;

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
    <div className="leaderboard-top-row-player">        
      <h1 className="leaderboard-top-row-place passion-one-font">{getPlace()}</h1>
      <LeaderboardTopRowPillar />
      <div className="leaderboard-top-row-player-icon">
        <ProfileIcon 
          color={profile.color}
          icon={profile.icon}
        /> 
      </div>
      <i className="leaderboard-top-row-icon fal fa-trophy-alt" />   
      <div className="leaderboard-top-row-player-username-wrapper">        
        <PlayerLevelBadge 
          color={profile.color} 
          experience={profile.experience} 
          inline
          mini 
        />
        <h1 
          className="leaderboard-top-row-player-username passion-one-font" 
          style={{ color: `rgb(${profile.color})` }}
          title={profile.username}
        >
          {profile.username}
        </h1>     
      </div>
      {getName()}
    </div>             
  );
}