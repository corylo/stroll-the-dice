import React from "react";

import { LeaderboardTopRowPillar } from "./leaderboardTopRowPillar";
import { PlayerLevelBadge } from "../../playerLevelBadge/playerLevelBadge";
import { ProfileIcon } from "../../profileIcon/profileIcon";

import { PlayerUtility } from "../../../utilities/playerUtility";

import { IPlayer } from "../../../../stroll-models/player";

interface LeaderboardTopRowPlayerProps {  
  place: number;
  player: IPlayer;
}

export const LeaderboardTopRowPlayer: React.FC<LeaderboardTopRowPlayerProps> = (props: LeaderboardTopRowPlayerProps) => {      
  const { profile } = props.player;

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
      <h1 className="leaderboard-top-row-place passion-one-font">{PlayerUtility.determineLeaderboardPlace(props.place)}</h1>
      <LeaderboardTopRowPillar />
      <div className="leaderboard-top-row-player-icon">
        <ProfileIcon 
          color={profile.color}
          icon={profile.icon}
        />       
        <PlayerLevelBadge 
          color={profile.color} 
          experience={profile.experience} 
          inline
          mini 
        />
      </div>
      <i className="leaderboard-top-row-icon fal fa-trophy-alt" />   
      <div className="leaderboard-top-row-player-username-wrapper">   
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