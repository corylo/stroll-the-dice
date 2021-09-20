import React from "react";
import classNames from "classnames";

import { UrlUtility } from "../../../../utilities/urlUtility";

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
      <div className={classNames("game-matchup-side-stat", UrlUtility.format(props.tooltip))}>      
        <Label icon={props.icon} tooltip={props.tooltip} />      
        <AnimatedCounter 
          initialValue={props.value} 
          value={props.value} 
          formatValue={props.formatValue} 
        />
      </div>
    );
  }
  
  return (
    <div className={classNames("game-matchup-side-stat", UrlUtility.format(props.tooltip))}>      
      <AnimatedCounter 
        initialValue={props.value} 
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