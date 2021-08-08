import React, { useContext } from "react";

import { GameDayStatement } from "../gameDayStatement/gameDayStatement";
import { ProfileIcon } from "../profileIcon/profileIcon";

import { AppContext } from "../app/contexts/appContext";

import { IProfile } from "../../../stroll-models/profile";

interface ProfileHeaderProps {
  profile: IProfile;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = (props: ProfileHeaderProps) => {
  const { appState } = useContext(AppContext);

  const { user } = appState,
    { profile } = props;
  
  const getEmail = (): JSX.Element => {
    if(user.profile.uid === profile.uid) {
      return (
        <h1 className="profile-email passion-one-font">{user.email}</h1>
      )
    }
  }

  const getUsername = (): JSX.Element => {
    if(profile.username !== "") {
      return (
        <div className="profile-username">
          <h1 className="passion-one-font" style={{ color: `rgb(${user.profile.color})` }}>{profile.username}</h1>          
          {/* <CopyButton
            icon="fal fa-link"
            tooltip="Profile"
            value={`${window.location.origin}/u/${profile.id}/${UrlUtility.format(profile.username)}`}
          /> */}
        </div>
      )
    }
  }

  const getAvailableGameDays = (): JSX.Element => {
    if(user.profile.uid === profile.uid) {
      return (        
        <div className="available-game-days">
          <h1 className="passion-one-font">You have <GameDayStatement quantity={user.stats.gameDays.available} /></h1>
        </div>
      )
    }
  }

  return(
    <div className="profile-header">
      <ProfileIcon color={profile.color} icon={profile.icon} />
      {getUsername()}
      {getEmail()}
      {getAvailableGameDays()}
    </div>
  );
}