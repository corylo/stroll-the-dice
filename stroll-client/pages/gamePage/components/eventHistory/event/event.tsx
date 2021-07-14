import React from "react";

import { EventDescription } from "../eventDescription/eventDescription";

import { FirestoreDateUtility } from "../../../../../../stroll-utilities/firestoreDateUtility";

import { IGameEvent } from "../../../../../../stroll-models/gameEvent/gameEvent";

interface EventProps {  
  event: IGameEvent;
}

export const Event: React.FC<EventProps> = (props: EventProps) => {      
  const { event } = props;

  return (
    <div className="game-event">
      <div className="game-event-header">
        <div className="game-event-type">
          <h1 className="passion-one-font">{event.type}</h1>
        </div>
        <div className="game-event-time">
          <h1 className="passion-one-font">{FirestoreDateUtility.timestampToDate(event.occurredAt).toLocaleTimeString()}</h1>      
        </div>
      </div>
      <EventDescription event={event} />
    </div>
  );
}