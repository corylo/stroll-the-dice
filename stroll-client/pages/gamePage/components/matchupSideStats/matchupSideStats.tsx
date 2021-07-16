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

  const getBorder = (): JSX.Element => <div className="game-matchup-side-stats-border" />;

  return (
    <div className="game-matchup-side-stats">
      {props.alignment === MatchupSideAlignment.Left ? getBorder() : null}
      <div className="game-matchup-side-stats-content">
        <MatchupSideStat 
          alignment={props.alignment}
          icon="fal fa-shoe-prints" 
          tooltip="Steps"
          value={side.steps ? side.steps.toLocaleString() : "0"} 
        />
        <MatchupSideStat 
          alignment={props.alignment}
          icon={Icon.Points}
          tooltip="Total Wagered"
          value={side.total.wagered ? NumberUtility.shorten(side.total.wagered) : "-"} 
        />
        <MatchupSideStat 
          alignment={props.alignment}
          icon="fal fa-dice" 
          tooltip="Return Ratio"
          value={`1 : ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(odds)}`} 
        />
        <MatchupSideStat 
          alignment={props.alignment}
          icon="fal fa-user-friends" 
          tooltip="Participants"
          value={side.total.participants} 
        />
      </div>
      {props.alignment === MatchupSideAlignment.Right ? getBorder() : null}
    </div>   
  );
}