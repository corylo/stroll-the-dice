import React from "react";

import { MatchupSideAlignment } from "./matchupSide";

interface MatchupSideStatProps {  
  alignment: MatchupSideAlignment;
  icon: string;
  value: number | string;
}

export const MatchupSideStat: React.FC<MatchupSideStatProps> = (props: MatchupSideStatProps) => {      
  if(props.alignment === MatchupSideAlignment.Left) {
    return (
      <div className="game-matchup-side-stat">
        <i className={props.icon} />
        <h1 className="passion-one-font">{props.value}</h1>
      </div>
    );
  }
  
  return (
    <div className="game-matchup-side-stat">      
      <h1 className="passion-one-font">{props.value}</h1>
      <i className={props.icon} />
    </div>
  );
}