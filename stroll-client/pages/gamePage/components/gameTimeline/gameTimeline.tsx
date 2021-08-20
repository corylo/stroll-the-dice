import React, { useContext } from "react";
import _groupBy from "lodash.groupby";

import { Button } from "../../../../components/buttons/button";
import { EmptyMessage } from "../../../../components/emptyMessage/emptyMessage";
import { EventGroup } from "./eventGroup";
import { LoadingIcon } from "../../../../components/loadingIcon/loadingIcon";

import { ViewGameTimelineContext } from "../viewGameTimelineModal/viewGameTimelineModal";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";

import { IGameEvent } from "../../../../../stroll-models/gameEvent/gameEvent";

import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface GameTimelineProps {  
  
}

export const GameTimeline: React.FC<GameTimelineProps> = (props: GameTimelineProps) => {    
  const { state, setState } = useContext(ViewGameTimelineContext);

  const getEvents = (): JSX.Element[] => {
    return Object.entries(_groupBy(state.events, (event: IGameEvent) => FirestoreDateUtility.timestampToDate(event.occurredAt).toDateString()))
      .map((entry: any) => ({ date: entry[0], events: entry[1] }))
      .map((entry: any) => (
        <EventGroup 
          key={entry.date} 
          date={entry.date} 
          events={entry.events} 
        />
      ));
  }

  const getViewMoreButton = (): JSX.Element => {
    if(
      state.statuses.more !== RequestStatus.Loading && 
      state.events.length !== 0 &&
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
    if(state.statuses.more !== RequestStatus.Loading && state.events.length === 0) {
      return (
        <EmptyMessage text="There were no events found" />
      )
    }
  }

  return (
    <div className="game-timeline">
      {getEvents()}
      {getLoadingIcon()}
      {getViewMoreButton()}
      {getEmptyMessage()}
    </div>
  );
}