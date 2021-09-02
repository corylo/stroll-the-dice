import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import { Button } from "../../../../components/buttons/button";
import { EmptyMessage } from "../../../../components/emptyMessage/emptyMessage";
import { LoadingIcon } from "../../../../components/loadingIcon/loadingIcon";
import { Table } from "../../../../components/table/table";

import { StatsPageContext } from "../../statsPage";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";
import { NumberUtility } from "../../../../../stroll-utilities/numberUtility";

import { IGameHistoryEntry } from "../../../../../stroll-models/gameHistoryEntry";

import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface GameHistoryProps {  
  
}

export const GameHistory: React.FC<GameHistoryProps> = (props: GameHistoryProps) => {  
  const { state, setState } = useContext(StatsPageContext);

  const history: any = useHistory();

  const getHistoryTable = (): JSX.Element => {
    if(state.statuses.initial !== RequestStatus.Loading && state.entries.length > 0) {
      const entries: JSX.Element[] = state.entries.map((entry: IGameHistoryEntry) => (
        <tr key={entry.id} className="passion-one-font" onClick={() => history.push(`/game/${entry.gameID}`)}>
          <td className="game-name">{entry.name}</td>
          <td>{entry.duration}</td>
          <td>{NumberUtility.shorten(entry.steps)}</td>
          <td>{NumberUtility.shorten(entry.points)}</td>
          <td>{entry.place}</td>
          <td className="game-ends-at">{FirestoreDateUtility.timestampToLocaleDateTime(entry.endsAt)}</td>
        </tr>
      ));

      return (
        <Table className="game-history-table">
          <thead>
            <tr className="passion-one-font">
              <th>Game</th>
              <th>Duration</th>
              <th>Steps</th>
              <th>Points</th>
              <th>Place</th>
              <th>Ended At</th>
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
      state.statuses.initial === RequestStatus.Loading &&
      state.statuses.more === RequestStatus.Loading && 
      state.entries.length === 0
    ) {
      return (
        <EmptyMessage text="No history available yet" />
      )
    }
  }

  return (
    <div className="game-history">
      {getHistoryTable()}
      {getViewMoreButton()}
      {getLoadingIcon()}
      {getEmptyMessage()}
    </div>
  );
}