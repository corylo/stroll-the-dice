import React, { createContext, useContext, useEffect, useState } from "react";

import { Button } from "../../../../components/buttons/button";
import { GameStat } from "./gameStat";
import { LoadingIcon } from "../../../../components/loadingIcon/loadingIcon";
import { ProfilePageSection } from "../profilePageSection/profilePageSection";
import { Table } from "../../../../components/table/table";
import { ViewGameHistoryModal } from "../viewGameHistoryModal/viewGameHistoryModal";

import { AppContext } from "../../../../components/app/contexts/appContext";

import { ProfileStatsService } from "../../../../services/profileStatsService";

import { NumberUtility } from "../../../../../stroll-utilities/numberUtility";

import { defaultGameStatsSectionState, IGameStatsSectionState } from "../../models/gameStatsSectionState";
import { IProfileGamesStats } from "../../../../../stroll-models/profileStats";

import { AppStatus } from "../../../../enums/appStatus";
import { Icon } from "../../../../../stroll-enums/icon";
import { ProfileStatsID } from "../../../../../stroll-enums/profileStatsID";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface IGameStatsSectionContext {
  state: IGameStatsSectionState;
  setState: (state: IGameStatsSectionState) => void;
}

export const GameStatsSectionContext = createContext<IGameStatsSectionContext>(null);

interface GameStatsSectionProps {  
  uid: string;
}

export const GameStatsSection: React.FC<GameStatsSectionProps> = (props: GameStatsSectionProps) => {    
  const { appState } = useContext(AppContext);

  const [state, setState] = useState<IGameStatsSectionState>(defaultGameStatsSectionState());

  const updateStatus = (status: RequestStatus): void => {
    setState({ ...state, status });
  }

  const toggleHistory = (history: boolean): void => {
    setState({ ...state, toggles: { ...state.toggles, history }});
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
        <React.Fragment>
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
            <Button
              className="view-game-history-button fancy-button"
              handleOnClick={() => toggleHistory(true)} 
            >
              <i className="fal fa-history" />
              <h1 className="passion-one-font">View Game History</h1>
            </Button>
          </div>          
          <ViewGameHistoryModal back={() => toggleHistory(false)} />
        </React.Fragment>
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
    <GameStatsSectionContext.Provider value={{ state, setState }}>
      <ProfilePageSection className="game-stats-section" icon="fal fa-chart-bar" title="Stats">
        {getContent()}
        {getLoading()}
      </ProfilePageSection>
    </GameStatsSectionContext.Provider>
  );
}