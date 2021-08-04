import React, { useContext } from "react";
import _groupBy from "lodash.groupby";

import { EmptyMessage } from "../../../../components/emptyMessage/emptyMessage";
import { EventGroup } from "./eventGroup";

import { GamePageContext } from "../../gamePage";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";

import { IGameEvent } from "../../../../../stroll-models/gameEvent/gameEvent";

interface EventHistoryProps {  
  
}

export const EventHistory: React.FC<EventHistoryProps> = (props: EventHistoryProps) => {    
  const { events } = useContext(GamePageContext).state;

  const getEvents = (): JSX.Element[] => {
    return Object.entries(_groupBy(events, (event: IGameEvent) => FirestoreDateUtility.timestampToDate(event.occurredAt).toDateString()))
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
    if(events.length === 0) {
      return (
        <EmptyMessage text="There were no events found" />
      )
    }
  }

  return (
    <div className="game-event-history">
      {getEvents()}
      {getEmptyMessage()}
    </div>
  );
}