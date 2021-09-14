import React from "react";

import { MatchupSideAlignment } from "../matchupSide/matchupSide";
import { MatchupSideStat } from "./matchupSideStat";

import { NumberUtility } from "../../../../../stroll-utilities/numberUtility";

import { IMatchupSide } from "../../../../../stroll-models/matchup";

import { Icon } from "../../../../../stroll-enums/icon";

interface MatchupSideStatsProps {  
  alignment: MatchupSideAlignment;
  odds: number;
  side: IMatchupSide;
}

export const MatchupSideStats: React.FC<MatchupSideStatsProps> = (props: MatchupSideStatsProps) => {  
  const { odds, side } = props;

  return (
    <div className="game-matchup-side-stats">
      <div className="game-matchup-side-stats-content">
        <MatchupSideStat 
          alignment={props.alignment}
          icon="fal fa-shoe-prints" 
          tooltip="Steps"
          value={side.steps}
          formatValue={(value: number) => value.toLocaleString()}
        />
        <MatchupSideStat 
          alignment={props.alignment}
          icon={Icon.Points}
          tooltip="Total Wagered"
          value={side.total.wagered}
          formatValue={(value: number) => NumberUtility.shorten(value)}
        />
        <MatchupSideStat 
          alignment={props.alignment}
          icon="fal fa-dice" 
          tooltip="Return Ratio"          
          value={odds}
          formatValue={(value: number) => `1 : ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value)}`}
        />
        <MatchupSideStat 
          alignment={props.alignment}
          icon="fal fa-user-friends" 
          tooltip="Participants"
          value={side.total.participants} 
        />
      </div>
    </div>   
  );
}