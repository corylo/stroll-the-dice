import React, { useContext } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { Button } from "../../../../components/buttons/button";
import { EmptyMessage } from "../../../../components/emptyMessage/emptyMessage";
import { LoadingIcon } from "../../../../components/loadingIcon/loadingIcon";
import { StatsPageSection } from "../statsPageSection/statsPageSection";
import { Table } from "../../../../components/table/table";

import { StatsPageContext } from "../../statsPage";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";
import { GameDurationUtility } from "../../../../../stroll-utilities/gameDurationUtility";
import { PlayerUtility } from "../../../../utilities/playerUtility";

import { IGameHistoryEntry } from "../../../../../stroll-models/gameHistoryEntry";

import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface GameHistoryProps {  
  
}

export const GameHistory: React.FC<GameHistoryProps> = (props: GameHistoryProps) => {  
  const { state, setState } = useContext(StatsPageContext);

  const getHistoryTable = (): JSX.Element => {
    if(state.statuses.initial !== RequestStatus.Loading && state.entries.length > 0) {
      const getIcon = (place: number): string => {
        if(place <= 3) {
          return "fal fa-trophy-alt";
        }

        return "fal fa-trophy";
      }

      const entries: JSX.Element[] = state.entries.map((entry: IGameHistoryEntry) => (
        <tr key={entry.id} className="passion-one-font">
          <td className="game-details">
            <Table>
              <tbody>
                <tr>
                  <td><Link to={`/game/${entry.gameID}`}>{entry.name}</Link></td>
                </tr>
                <tr>
                  <td><h1 className="game-ends-at">Ended {FirestoreDateUtility.timestampToLocaleDateTime(entry.endsAt)} ({GameDurationUtility.getLabel(entry.duration)})</h1></td>
                </tr>
              </tbody>
            </Table>
          </td>          
          <td>
            <div className={classNames("player-place", `player-place-${entry.place}`)}>
              <i className={classNames("player-place-icon", getIcon(entry.place))} />
              <h1 className="player-place-label">{PlayerUtility.determineLeaderboardPlace(entry.place)}</h1>
            </div>
          </td>
          <td>{entry.steps.toLocaleString()}</td>
          <td>{entry.points.toLocaleString()}</td>
        </tr>
      ));

      return (
        <Table className="game-history-table">
          <thead>
            <tr className="passion-one-font">
              <th>Game Details</th>
              <th>Place</th>
              <th>Steps</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {entries}
          </tbody>
        </Table>
      )
    }
  }

  const getViewMoreButton = (): JSX.Element => {
    if(
      state.statuses.more !== RequestStatus.Loading && 
      state.entries.length !== 0 &&
      !state.end
    ) {
      return (        
        <Button 
          className="view-more-button passion-one-font" 
          handleOnClick={() => setState({ ...state, index: state.index + 1 })}
        >
          View more
        </Button>
      )
    }
  }

  const getLoadingIcon = (): JSX.Element => {
    if(
      state.statuses.initial === RequestStatus.Loading || 
      state.statuses.more === RequestStatus.Loading
    ) {
      return (
        <div className="view-more-loading-icon">
          <LoadingIcon />
        </div>
      )
    }
  }

  const getEmptyMessage = (): JSX.Element => {
    if(
      state.statuses.stats !== RequestStatus.Loading &&
      state.statuses.initial !== RequestStatus.Loading &&
      state.statuses.more !== RequestStatus.Loading && 
      state.entries.length === 0
    ) {
      return (
        <EmptyMessage text="No history available yet" />
      )
    }
  }

  return (
    <StatsPageSection className="game-history" title="Game History">    
      {getHistoryTable()}
      {getViewMoreButton()}
      {getLoadingIcon()}
      {getEmptyMessage()}
    </StatsPageSection>
  );
}