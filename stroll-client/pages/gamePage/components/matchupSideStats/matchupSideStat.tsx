import React from "react";

import { Label } from "../../../../components/label/label";
import { MatchupSideAlignment } from "../matchupSide/matchupSide";
import { TooltipSide } from "../../../../components/tooltip/tooltip";

interface MatchupSideStatProps {  
  alignment: MatchupSideAlignment;
  icon: string;
  tooltip: string;
  value: number | string;
}

export const MatchupSideStat: React.FC<MatchupSideStatProps> = (props: MatchupSideStatProps) => {      
  if(props.alignment === MatchupSideAlignment.Left) {
    return (
      <div className="game-matchup-side-stat">
        <Label icon={props.icon} tooltip={props.tooltip} />
        <h1 className="passion-one-font">{props.value}</h1>
      </div>
    );
  }
  
  return (
    <div className="game-matchup-side-stat">      
      <h1 className="passion-one-font">{props.value}</h1>
      <Label icon={props.icon} tooltip={props.tooltip} tooltipSide={TooltipSide.Left} />
    </div>
  );
}