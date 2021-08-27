import React from "react";

import { ProfileIcon } from "../profileIcon/profileIcon";
import { Tooltip, TooltipSide } from "../tooltip/tooltip";

import { IProfileReference } from "../../../stroll-models/profileReference";

interface UserLinkProps {  
  profile: IProfileReference;
  tooltip?: string;
}

export const UserLink: React.FC<UserLinkProps> = (props: UserLinkProps) => {  
  const { profile } = props;

  const getTooltip = (): JSX.Element => {
    if(props.tooltip) {
      return (
        <Tooltip text={props.tooltip} side={TooltipSide.Bottom} />
      )
    }
  }

  const getName = (): JSX.Element => {
    if(profile.name) {
      return (        
        <h1 className="user-link-name passion-one-font thin-text-border">
          {profile.name}
        </h1>  
      )
    }
  }
  
  return (
    <div className="user-link">
      <ProfileIcon color={profile.color} icon={profile.icon} />
      <div className="user-link-content">
        <div className="user-link-username-wrapper">
          <h1 className="user-link-username passion-one-font thin-text-border" style={{ color: `rgb(${profile.color})` }}>
            {profile.username}
          </h1>    
          {getTooltip()}
        </div> 
        {getName()}     
      </div>
    </div>
  );
}