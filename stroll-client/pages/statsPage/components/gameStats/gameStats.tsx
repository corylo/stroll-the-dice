import React, { useContext } from "react";

import { GameStat } from "./gameStat";
import { StatsPageSection } from "../statsPageSection/statsPageSection";
import { Table } from "../../../../components/table/table";

import { StatsPageContext } from "../../statsPage";

import { NumberUtility } from "../../../../../stroll-utilities/numberUtility";

import { Icon } from "../../../../../stroll-enums/icon";

interface GameStatsSectionProps {  
  
}

export const GameStats: React.FC<GameStatsSectionProps> = (props: GameStatsSectionProps) => {    
  const { state } = useContext(StatsPageContext);

  const getWinPercentage = (): string => {
    if(state.stats.gamesPlayed > 0) {
      return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format((state.stats.wins / state.stats.gamesPlayed) * 100);
    }

    return "0";
  }

  const getDailyValue = (value: number): string => {
    if(value > 0) {
      return NumberUtility.shorten(Math.round(value / state.stats.daysPlayed))
    }

    return "0";
  }

  return (    
    <React.Fragment>
      <StatsPageSection className="game-stats-section">
        <div className="game-stats">
          <GameStat 
            dailyValue={getDailyValue(state.stats.steps)}
            icon={Icon.Steps} 
            label="Steps" 
            value={NumberUtility.shorten(state.stats.steps)} 
          />
          <GameStat 
            dailyValue={getDailyValue(state.stats.points)}
            icon={Icon.Points} 
            label="Points" 
            value={NumberUtility.shorten(state.stats.points)} 
          />
        </div>
      </StatsPageSection>      
      <StatsPageSection className="game-history-section" title="Game Stats">
        <Table className="game-stats-table">
          <thead>
            <tr>
              <th className="passion-one-font">Games Played</th>
              <th className="passion-one-font">Days Played</th>
              <th className="passion-one-font">Wins</th>
              <th className="passion-one-font">Win %</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="passion-one-font">{state.stats.gamesPlayed}</td>
              <td className="passion-one-font">{state.stats.daysPlayed}</td>
              <td className="passion-one-font">{state.stats.wins}</td>
              <td className="passion-one-font">{getWinPercentage()}</td>
            </tr>
          </tbody>
        </Table>
      </StatsPageSection>
    </React.Fragment>   
  )
}