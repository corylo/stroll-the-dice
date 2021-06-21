import React from "react";

import { ProfileIcon } from "../../../../components/profileIcon/profileIcon";

import { IProfile } from "../../../../../stroll-models/profile";

interface MatchupSideProps {  
  profile?: IProfile;
}

export const MatchupSide: React.FC<MatchupSideProps> = (props: MatchupSideProps) => {    
  const { profile } = props;

  if(profile) {
    return (
      <div className="game-matchup-side">
        <ProfileIcon 
          color={profile.color}
          icon={profile.icon}
        />
        <h1 className="game-matchup-side-username passion-one-font" style={{ color: `rgb(${profile.color})` }}>{profile.username}</h1>     
      </div>
    )
  }

  return (
    <div className="game-matchup-side">
      <ProfileIcon anonymous />
      <h1 className="game-matchup-side-username passion-one-font" style={{ color: "rgb(230, 230, 230)" }}>Undetermined</h1>     
    </div>
  );
}