import React, { useContext } from "react";

import { Button } from "../../../components/buttons/button";
import { EmptyMessage } from "../../../components/emptyMessage/emptyMessage";
import { LoadingIcon } from "../../../components/loadingIcon/loadingIcon";
import { MyGameDaysPageContext } from "../myGameDaysPage";
import { Table } from "../../../components/table/table";

import { FirestoreDateUtility } from "../../../../stroll-utilities/firestoreDateUtility";

import { IGameDayHistoryEntry } from "../../../../stroll-models/gameDayHistoryEntry/gameDayHistoryEntry";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";
import { GameDayHistoryEntryType } from "../../../../stroll-enums/gameDayHistoryEntryType";

interface MyGameDayHistoryProps {  
  
}

export const MyGameDayHistory: React.FC<MyGameDayHistoryProps> = (props: MyGameDayHistoryProps) => {  
  const { state, setState } = useContext(MyGameDaysPageContext);

  const getHistoryTable = (): JSX.Element => {
    if(state.statuses.initial !== RequestStatus.Loading && state.entries.length > 0) {
      const getType = (type: GameDayHistoryEntryType): JSX.Element => {
        switch(type) {
          case GameDayHistoryEntryType.Gift:
            return (
              <div className="game-day-history-entry-type">
                <i className="fal fa-gift" />
                <h1>Gift</h1>
              </div>
            )
          case GameDayHistoryEntryType.Purchase:
            return (
              <div className="game-day-history-entry-type">
                <i className="fal fa-inbox-in" />
                <h1>Purchase</h1>
              </div>
            )
          case GameDayHistoryEntryType.Use:
            return (
              <div className="game-day-history-entry-type">
                <i className="fal fa-inbox-out" />
                <h1>Redeemed</h1>
              </div>
            )
          default:
            throw new Error(`Unknown history entry type ${type}`);
        }
      }

      console.log(state.entries);

      const entries: JSX.Element[] = state.entries.map((entry: IGameDayHistoryEntry) => (
        <tr key={entry.id} className="passion-one-font">
          <td>{entry.quantity.toLocaleString()}</td>
          <td>{getType(entry.type)}</td>
          <td>
            <div className="game-day-history-entry-date">
              <h1>{FirestoreDateUtility.timestampToLocaleDate(entry.occurredAt)}</h1>
              <h1>{FirestoreDateUtility.timestampToDate(entry.occurredAt).toLocaleTimeString()}</h1>               
            </div>
          </td>
        </tr>
      ));

      return (
        <Table className="my-game-day-history-table">
          <thead>
            <tr className="passion-one-font">
              <th>Quantity</th>
              <th>Type</th>
              <th>Date</th>
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
    if(state.statuses.more === RequestStatus.Loading) {
      return (
        <div className="view-more-loading-icon">
          <LoadingIcon />
        </div>
      )
    }
  }

  const getEmptyMessage = (): JSX.Element => {
    if(
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
    <div className="my-game-day-history">    
      <div className="my-game-day-history-title">
        <h1 className="my-game-day-history-title-text passion-one-font">Game Day History</h1>     
      </div>
      {getHistoryTable()}
      {getViewMoreButton()}
      {getLoadingIcon()}
      {getEmptyMessage()}
    </div>
  );
}