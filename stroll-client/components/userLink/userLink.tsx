import React from "react";

import { ProfileIcon } from "../profileIcon/profileIcon";
import { Tooltip, TooltipSide } from "../tooltip/tooltip";

import { UrlUtility } from "../../utilities/urlUtility";

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
        <a href={`/u/${profile.id}/${UrlUtility.format(profile.username)}`} className="username passion-one-font">
          {profile.username}
        </a>      
        {getTooltip()}
      </div>
    </div>
  );
}