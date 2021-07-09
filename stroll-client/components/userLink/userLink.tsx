import React from "react";

import { ProfileIcon } from "../profileIcon/profileIcon";
import { Tooltip, TooltipSide } from "../tooltip/tooltip";

import { IProfile } from "../../../stroll-models/profile";

interface UserLinkProps {  
  profile: IProfile;
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
  
  return (
    <div className="user-link">
      <ProfileIcon color={profile.color} icon={profile.icon} />
      <div className="username-wrapper">
        <h1 className="username passion-one-font">
          {profile.username}
        </h1>      
        {getTooltip()}
      </div>
    </div>
  );
}