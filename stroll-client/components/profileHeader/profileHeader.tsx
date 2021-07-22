import React, { useContext } from "react";

import { Dot } from "../dot/dot";
import { IconButton } from "../buttons/iconButton";
import { ProfileIcon } from "../profileIcon/profileIcon";
import { TooltipSide } from "../tooltip/tooltip";

import { AppContext } from "../app/contexts/appContext";

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

  const getEmail = (): JSX.Element => {
    if(user && user.profile.uid === profile.uid) {
      return (
        <h1 className="profile-email passion-one-font">{user.email}</h1>
      )
    }
  }

  const getUpdateButton = (): JSX.Element => {
    if(user && user.profile.uid === profile.uid) {
      return (
        <React.Fragment>
          <Dot />
          <IconButton
            className="update-profile-button inline-icon-button"
            icon="fal fa-pen" 
            tooltip="Update"
            tooltipSide={TooltipSide.Bottom}
            handleOnClick={() => dispatch(AppAction.ToggleUpdateProfile, !appState.toggles.profile)} 
          />
        </React.Fragment>
      )
    }
  }

  const getUsername = (): JSX.Element => {
    if(profile.username !== "") {
      return (
        <div className="profile-username">
          <h1 className="passion-one-font" style={{ color: `rgb(${user.profile.color})` }}>{profile.username}</h1>
          {getUpdateButton()}
          {/* <CopyButton
            icon="fal fa-link"
            tooltip="Profile"
            value={`${window.location.origin}/u/${profile.id}/${UrlUtility.format(profile.username)}`}
          /> */}
        </div>
      )
    }
  }

  return(
    <div className="profile-header">
      <ProfileIcon color={profile.color} icon={profile.icon} />
      {getUsername()}
      {getEmail()}
    </div>
  );
}