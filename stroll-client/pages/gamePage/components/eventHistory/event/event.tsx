import React from "react";

import { EventDescription } from "../eventDescription/eventDescription";
import { EventType } from "../eventType/eventType";

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
        <EventType type={event.type} />
        <div className="game-event-time">
          <h1 className="passion-one-font">{FirestoreDateUtility.timestampToDate(event.occurredAt).toLocaleTimeString()}</h1>      
        </div>
      </div>
      <EventDescription event={event} />
    </div>
  );
}