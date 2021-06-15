import React from "react";

import { ProfileIcon } from "../profileIcon/profileIcon";

import { UrlUtility } from "../../utilities/urlUtility";

import { IProfile } from "../../../stroll-models/profile";

interface UserLinkProps {  
  profile: IProfile;
}

export const UserLink: React.FC<UserLinkProps> = (props: UserLinkProps) => {  
  const { profile } = props;
  
  return (
    <div className="user-link">
      <ProfileIcon color={profile.color} icon={profile.icon} />
      <a href={`/u/${profile.id}/${UrlUtility.format(profile.username)}`} className="username passion-one-font">{profile.username}</a>
    </div>
  );
}