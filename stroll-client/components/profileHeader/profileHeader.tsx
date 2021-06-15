import React, { useContext, useEffect, useState } from "react";

import { Button } from "../buttons/button";
import { CopyButton } from "../copyButton/copyButton";
import { Dot } from "../dot/dot";
import { ProfileIcon } from "../profileIcon/profileIcon";

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
        <h1 className="profile-full-name passion-one-font">{user.name}</h1>
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
            icon="fad fa-link"
            tooltip="Profile"
            value={`${window.location.origin}/u/${profile.id}/${UrlUtility.format(profile.username)}`}
          />
        </div>
      )
    }
  }

  const getUpdateButton = (): JSX.Element => {
    if(user && user.profile.uid === profile.uid) {
      return (        
        <Button 
          className="update-profile-button fancy-button" 
          handleOnClick={() => dispatch(AppAction.ToggleUpdateProfile, !appState.toggles.profile)}
        >
          <i className="fad fa-pen" />
          <h1 className="passion-one-font">Update</h1>
        </Button>
      )
    }
  }

  return(
    <div className="profile-header">
      <ProfileIcon color={profile.color} icon={profile.icon} />
      {getFullName()}
      {getUsername()}
      {getUpdateButton()}
    </div>
  );
}