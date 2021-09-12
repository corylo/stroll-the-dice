import React from "react";

import { IProfileReference } from "../../../stroll-models/profileReference";

interface PlayerStatementProps {  
  profile: IProfileReference;
}

export const PlayerStatement: React.FC<PlayerStatementProps> = (props: PlayerStatementProps) => {  
  const { profile } = props;

  const style: React.CSSProperties = { color: `rgb(${profile.color})` };
      
  return (
    <span className="player-statement passion-one-font"><i className={profile.icon} style={style} /><span style={style}>{profile.username}</span></span>
  );
}