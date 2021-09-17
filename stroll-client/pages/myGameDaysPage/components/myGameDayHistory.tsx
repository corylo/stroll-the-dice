import React, { useContext } from "react";
import classNames from "classnames";

import { Button } from "../../../components/buttons/button";
import { EmptyMessage } from "../../../components/emptyMessage/emptyMessage";
import { LoadingIcon } from "../../../components/loadingIcon/loadingIcon";
import { MyGameDaysPageContext } from "../myGameDaysPage";
import { Table } from "../../../components/table/table";

import { AppContext } from "../../../components/app/contexts/appContext";

import { FirestoreDateUtility } from "../../../../stroll-utilities/firestoreDateUtility";

import { IGameDayHistoryEntry } from "../../../../stroll-models/gameDayHistoryEntry/gameDayHistoryEntry";
import { IGameDayHistoryGiftEntry } from "../../../../stroll-models/gameDayHistoryEntry/gameDayHistoryGiftEntry";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";
import { GameDayHistoryEntryType } from "../../../../stroll-enums/gameDayHistoryEntryType";

interface MyGameDayHistoryProps {  
  
}

export const MyGameDayHistory: React.FC<MyGameDayHistoryProps> = (props: MyGameDayHistoryProps) => {  
  const { appState } = useContext(AppContext);

  const { user } = appState;

  const { state, setState } = useContext(MyGameDaysPageContext);

  const getHistoryTable = (): JSX.Element => {
    if(state.statuses.initial !== RequestStatus.Loading && state.entries.length > 0) {
      const getType = (entry: IGameDayHistoryEntry): JSX.Element => {
        switch(entry.type) {
          case GameDayHistoryEntryType.Gift:
            const gift: IGameDayHistoryGiftEntry = entry as IGameDayHistoryGiftEntry,
              outgoing: boolean = gift.to !== user.profile.uid;

            return (
              <div className="game-day-history-entry-type">
                <i className={outgoing ? "fal fa-inbox-out" : "fal fa-inbox-in"} />
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
            throw new Error(`Unknown history entry type ${entry.type}`);
        }
      }

      const getClassName = (entry: IGameDayHistoryEntry): string => {
        if(
          entry.type === GameDayHistoryEntryType.Purchase ||
          entry.type === GameDayHistoryEntryType.Use
        ) {
          return entry.type.toLowerCase();
        } else if (entry.type === GameDayHistoryEntryType.Gift) {
          const gift: IGameDayHistoryGiftEntry = entry as IGameDayHistoryGiftEntry;

          return `${GameDayHistoryEntryType.Gift.toLowerCase()}-${gift.to !== user.profile.uid ? "outgoing" : "incoming"}`;
        }
      }

      const entries: JSX.Element[] = state.entries.map((entry: IGameDayHistoryEntry) => (
        <tr key={entry.id} className={classNames("game-day-history-entry", getClassName(entry), "passion-one-font")}>
          <td>{entry.quantity.toLocaleString()}</td>
          <td>{getType(entry)}</td>
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