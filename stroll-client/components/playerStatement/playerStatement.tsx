import React from "react";

import { IProfile } from "../../../stroll-models/profile";

interface PlayerStatementProps {  
  profile: IProfile
}

export const PlayerStatement: React.FC<PlayerStatementProps> = (props: PlayerStatementProps) => {  
  const { profile } = props;

  const style: React.CSSProperties = { color: `rgb(${profile.color})` };
      
  return (
    <span className="player-statement"><i className={profile.icon} style={style} /> <span style={style}> {profile.username}</span></span>
  );
}