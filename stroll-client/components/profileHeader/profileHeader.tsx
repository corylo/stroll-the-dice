import React, { useContext } from "react";

import { PlayerLevelBadge } from "../playerLevelBadge/playerLevelBadge";
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
  
  const getProfileInfo = (): JSX.Element => {
    if(profile.username !== "") {
      const getEmail = (): JSX.Element => {
        if(user.profile.uid === profile.uid) {
          return (
            <div className="profile-email">
              <h1 className="profile-email-text passion-one-font">{user.email}</h1>
              <h1 className="profile-email-disclaimer passion-one-font">(only you can see)</h1>
              <PlayerLevelBadge 
                clickable
                experience={user.profile.experience} 
                miniVerbose 
              />
            </div>
          )
        }
      }
    
      return (
        <div className="profile-info">
          <h1 className="profile-username passion-one-font" style={{ color: `rgb(${user.profile.color})` }}>{profile.username}</h1>          
          {getEmail()}   
        </div>
      )
    }
  }

  return(
    <div className="profile-header">
      <ProfileIcon color={profile.color} icon={profile.icon} />
      {getProfileInfo()}
    </div>
  );
}