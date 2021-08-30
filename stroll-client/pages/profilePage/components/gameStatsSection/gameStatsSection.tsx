import React, { useContext, useEffect, useState } from "react";

import { GameStat } from "./gameStat";
import { LoadingIcon } from "../../../../components/loadingIcon/loadingIcon";
import { ProfilePageSection } from "../profilePageSection/profilePageSection";
import { Table } from "../../../../components/table/table";

import { AppContext } from "../../../../components/app/contexts/appContext";

import { ProfileStatsService } from "../../../../services/profileStatsService";

import { NumberUtility } from "../../../../../stroll-utilities/numberUtility";

import { defaultProfileGamesStats, IProfileGamesStats } from "../../../../../stroll-models/profileStats";

import { AppStatus } from "../../../../enums/appStatus";
import { Icon } from "../../../../../stroll-enums/icon";
import { ProfileStatsID } from "../../../../../stroll-enums/profileStatsID";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface IGameStatsSectionState {
  stats: IProfileGamesStats;
  status: RequestStatus;
}

interface GameStatsSectionProps {  
  uid: string;
}

export const GameStatsSection: React.FC<GameStatsSectionProps> = (props: GameStatsSectionProps) => {    
  const { appState } = useContext(AppContext);

  const [state, setState] = useState<IGameStatsSectionState>({ stats: defaultProfileGamesStats(), status: RequestStatus.Loading });

  const updateStatus = (status: RequestStatus): void => {
    setState({ ...state, status });
  }

  useEffect(() => {
    if(appState.status === AppStatus.SignedIn && props.uid !== "") {
      const fetch = async (): Promise<void> => {
        try {
          updateStatus(RequestStatus.Loading);

          const stats: IProfileGamesStats = await ProfileStatsService.getByUID(props.uid, ProfileStatsID.Games) as IProfileGamesStats;

          setState({ ...state, stats, status: RequestStatus.Success });
        } catch (err) {
          console.error(err);

          updateStatus(RequestStatus.Error);
        }
      }

      fetch();
    }
  }, [appState.status, props.uid]);

  const getContent = (): JSX.Element => {
    if(state.status === RequestStatus.Success) {
      const winPercentage: string = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format((state.stats.wins / state.stats.gamesPlayed) * 100);

      return (
        <div className="game-stats-wrapper">
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
                <td className="passion-one-font">{winPercentage}</td>
              </tr>
            </tbody>
          </Table>
          <div className="game-stats">
            <GameStat 
              dailyValue={NumberUtility.shorten(Math.round(state.stats.steps / state.stats.daysPlayed))}
              icon={Icon.Steps} 
              label="Steps" 
              value={NumberUtility.shorten(state.stats.steps)} 
            />
            <GameStat 
              dailyValue={NumberUtility.shorten(Math.round(state.stats.points / state.stats.daysPlayed))}
              icon={Icon.Points} 
              label="Points" 
              value={NumberUtility.shorten(state.stats.points)} 
            />
          </div>
        </div>
      )
    }
  }

  const getLoading = (): JSX.Element => {
    if(state.status === RequestStatus.Loading) {
      return (
        <LoadingIcon />
      )
    }
  }

  return (
    <ProfilePageSection className="game-stats-section" icon="fal fa-chart-bar" title="Stats">
      {getContent()}
      {getLoading()}
    </ProfilePageSection>
  );
}