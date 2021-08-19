import React from "react";
import _orderBy from "lodash.orderby";

import { AnimatedCounter } from "../../animatedCounter/animatedCounter";
import { UserLink } from "../../userLink/userLink";

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
    <div className="leaderboard-remaining-row leaderboard-row">
      <div className="leaderboard-remaining-row-border" />
      <div className="leaderboard-remaining-row-content">
        <h1 className="leaderboard-row-place passion-one-font">{props.place}</h1>
        <div className="leaderboard-row-player-and-points">
          <UserLink key={props.profile.uid} profile={props.profile} />          
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
    </div>
  );
}