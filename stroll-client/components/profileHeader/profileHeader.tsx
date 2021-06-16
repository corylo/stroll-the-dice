import React, { useContext } from "react";

import { CopyButton } from "../copyButton/copyButton";
import { Dot } from "../dot/dot";
import { IconButton } from "../buttons/iconButton";
import { ProfileIcon } from "../profileIcon/profileIcon";
import { TooltipSide } from "../tooltip/tooltip";

import { AppContext } from "../app/contexts/appContext";

import { UrlUtility } from "../../utilities/urlUtility";

import { IProfile } from "../../../stroll-models/profile";

import { AppAction } from "../../enums/appAction";

interface ProfileHeaderProps {
  profile: IProfile;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = (props: ProfileHeaderProps) => {
  const { appState, dispatchToApp } = useContext(AppContext);

  const { user } = appState,
    { profile } = props;
  
  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const getFullName = (): JSX.Element => {
    if(user && user.profile.uid === profile.uid) {
      return (
        <div className="profile-full-name-wrapper">
          <h1 className="profile-full-name passion-one-font">{user.name}</h1>
          <Dot />
          <IconButton
            className="update-profile-button inline-icon-button"
            icon="fal fa-pen" 
            tooltip="Update"
            tooltipSide={TooltipSide.Bottom}
            handleOnClick={() => dispatch(AppAction.ToggleUpdateProfile, !appState.toggles.profile)} 
          />
        </div>
      )
    }
  }

  const getUsername = (): JSX.Element => {
    if(profile.username !== "") {
      return (
        <div className="profile-username">
          <h1 className="passion-one-font">{profile.username}</h1>
          <Dot />
          <CopyButton
            icon="fal fa-link"
            tooltip="Profile"
            value={`${window.location.origin}/u/${profile.id}/${UrlUtility.format(profile.username)}`}
          />
        </div>
      )
    }
  }

  return(
    <div className="profile-header">
      <ProfileIcon color={profile.color} icon={profile.icon} />
      {getFullName()}
      {getUsername()}
    </div>
  );
}