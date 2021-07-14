import React from "react";
import _groupBy from "lodash.groupby";

import { EventGroup } from "./eventGroup";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";

import { IGameEvent } from "../../../../../stroll-models/gameEvent/gameEvent";

interface EventHistoryProps {  
  events: IGameEvent[];
}

export const EventHistory: React.FC<EventHistoryProps> = (props: EventHistoryProps) => {    
  const getEvents = (): JSX.Element[] => {
    return Object.entries(_groupBy(props.events, (event: IGameEvent) => FirestoreDateUtility.timestampToDate(event.occurredAt).toDateString()))
      .map((entry: any) => ({ date: entry[0], events: entry[1] }))
      .map((entry: any) => (
        <EventGroup 
          key={entry.date} 
          date={entry.date} 
          events={entry.events} 
        />
      ));
  }

  return (
    <div className="game-event-history">
      {getEvents()}
    </div>
  );
}