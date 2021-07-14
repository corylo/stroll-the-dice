import React from "react";

import { EventDescription } from "../eventDescription/eventDescription";
import { EventType } from "../eventType/eventType";

import { FirestoreDateUtility } from "../../../../../../stroll-utilities/firestoreDateUtility";
import { GameEventUtility } from "../../../../../../stroll-utilities/gameEventUtility";

import { IGameEvent } from "../../../../../../stroll-models/gameEvent/gameEvent";

interface EventProps {  
  event: IGameEvent;
}

export const Event: React.FC<EventProps> = (props: EventProps) => {      
  const { event } = props;
  
  const color: string = GameEventUtility.getColor(event.type);

  const background: string = `linear-gradient(
    to right, 
    rgba(${color}, 0.1), 
    transparent 60%
  )`;

  return (
    <div className="game-event">
      <div className="game-event-color-indicator" style={{ backgroundColor: `rgb(${color})` }} />
      <div className="game-event-content" style={{ background }}>
        <div className="game-event-header">
          <EventType type={event.type} />
          <div className="game-event-time">
            <h1 className="passion-one-font">{FirestoreDateUtility.timestampToDate(event.occurredAt).toLocaleTimeString()}</h1>      
          </div>
        </div>
        <EventDescription event={event} />
      </div>
    </div>
  );
}