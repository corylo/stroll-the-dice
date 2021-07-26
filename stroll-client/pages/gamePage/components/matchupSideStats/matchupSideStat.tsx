import React from "react";

import { AnimatedCounter } from "../../../../components/animatedCounter/animatedCounter";
import { Label } from "../../../../components/label/label";
import { MatchupSideAlignment } from "../matchupSide/matchupSide";
import { TooltipSide } from "../../../../components/tooltip/tooltip";

interface MatchupSideStatProps {  
  alignment: MatchupSideAlignment;
  icon: string;
  tooltip: string;
  value: number;
  formatValue?: (value: number) => string;
}

export const MatchupSideStat: React.FC<MatchupSideStatProps> = (props: MatchupSideStatProps) => {      
  if(props.alignment === MatchupSideAlignment.Left) {
    return (
      <div className="game-matchup-side-stat">
        <Label icon={props.icon} tooltip={props.tooltip} />      
        <AnimatedCounter 
          value={props.value} 
          formatValue={props.formatValue} 
        />
      </div>
    );
  }
  
  return (
    <div className="game-matchup-side-stat">      
      <AnimatedCounter 
        value={props.value} 
        formatValue={props.formatValue} 
      />
      <Label 
        icon={props.icon} 
        tooltip={props.tooltip} 
        tooltipSide={TooltipSide.Left} 
      />
    </div>
  );
}