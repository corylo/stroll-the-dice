import React, { useContext } from "react";
import _groupBy from "lodash.groupby";

import { EmptyMessage } from "../../../../components/emptyMessage/emptyMessage";
import { EventGroup } from "./eventGroup";

import { ViewGameTimelineContext } from "../viewGameTimelineModal/viewGameTimelineModal";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";

import { IGameEvent } from "../../../../../stroll-models/gameEvent/gameEvent";

interface GameTimelineProps {  
  
}

export const GameTimeline: React.FC<GameTimelineProps> = (props: GameTimelineProps) => {    
  const { state } = useContext(ViewGameTimelineContext)

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

  const getEmptyMessage = (): JSX.Element => {
    if(state.events.length === 0) {
      return (
        <EmptyMessage text="There were no events found" />
      )
    }
  }

  return (
    <div className="game-timeline">
      {getEvents()}
      {getEmptyMessage()}
    </div>
  );
}