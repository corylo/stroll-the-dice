import React from "react";

import { AnimatedCounter } from "../../animatedCounter/animatedCounter";
import { UserLink } from "../../userLink/userLink";

import { PlayerUtility } from "../../../utilities/playerUtility";

import { IProfileReference } from "../../../../stroll-models/profileReference";

import { Icon } from "../../../../stroll-enums/icon";

interface LeaderboardRowProps {  
  amount: number;
  icon?: Icon;
  place: number;
  profile: IProfileReference;
}

export const LeaderboardRow: React.FC<LeaderboardRowProps> = (props: LeaderboardRowProps) => {        
  return (
    <div className="leaderboard-row leaderboard-row">
      <div className="leaderboard-row-content">
        <div className="leaderboard-row-place-and-player">
          <h1 className="leaderboard-row-place passion-one-font">{PlayerUtility.determineLeaderboardPlace(props.place)}</h1>
          <UserLink key={props.profile.uid} profile={props.profile} />          
        </div>
        <div className="leaderboard-row-points">
          <i className={props.icon || Icon.Points} />                 
          <AnimatedCounter 
            initialValue={props.amount} 
            value={props.amount} 
            formatValue={(value: number) => value.toLocaleString()} 
          />
        </div>
      </div>
    </div>
  );
}