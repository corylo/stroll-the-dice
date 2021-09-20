import React from "react";

import { GameStat } from "./gameStat";
import { StatsSection } from "../statsSection/statsSection";
import { Table } from "../table/table";

import { NumberUtility } from "../../../stroll-utilities/numberUtility";

import { IProfileGamesStats } from "../../../stroll-models/profileStats";

import { Icon } from "../../../stroll-enums/icon";

interface GameStatsSectionProps {  
  stats: IProfileGamesStats;
}

export const GameStats: React.FC<GameStatsSectionProps> = (props: GameStatsSectionProps) => {    
  const { stats } = props;

  const getDailyValue = (value: number): string => {
    if(value > 0) {
      return NumberUtility.shorten(Math.round(value / stats.daysPlayed))
    }

    return "0";
  }

  return (    
    <React.Fragment>
      <StatsSection className="game-stats-section">
        <div className="game-stats">
          <GameStat 
            dailyValue={getDailyValue(stats.steps)}
            icon={Icon.Steps} 
            label="Steps" 
            value={NumberUtility.shorten(stats.steps)} 
          />
          <GameStat 
            dailyValue={getDailyValue(stats.points)}
            icon={Icon.Points} 
            label="Points" 
            value={NumberUtility.shorten(stats.points)} 
          />
        </div>
      </StatsSection>      
      <StatsSection className="game-history-section" title="Game Stats">
        <Table className="game-stats-table">
          <thead>
            <tr>
              <th className="passion-one-font">Games Played</th>
              <th className="passion-one-font">Days Played</th>
              <th className="passion-one-font">Wins</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="passion-one-font">{stats.gamesPlayed}</td>
              <td className="passion-one-font">{stats.daysPlayed}</td>
              <td className="passion-one-font">{stats.wins}</td>
            </tr>
          </tbody>
        </Table>
      </StatsSection>
    </React.Fragment>   
  )
}