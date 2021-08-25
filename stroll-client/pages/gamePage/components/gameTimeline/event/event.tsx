import React from "react";
import classNames from "classnames";

import { EventDescription } from "../eventDescription/eventDescription";
import { EventType } from "../eventType/eventType";

import { FirestoreDateUtility } from "../../../../../../stroll-utilities/firestoreDateUtility";
import { UrlUtility } from "../../../../../utilities/urlUtility";

import { IGameEvent } from "../../../../../../stroll-models/gameEvent/gameEvent";

interface EventProps {  
  event: IGameEvent;
}

export const Event: React.FC<EventProps> = (props: EventProps) => {      
  const { event } = props;
  
  return (
    <div className={classNames("game-event", UrlUtility.format(event.type))}>
      <div className="game-event-content">
        <div className="game-event-header">
          <EventType event={event} />
          <div className="game-event-time">
            <h1 className="passion-one-font">{FirestoreDateUtility.timestampToDate(event.occurredAt).toLocaleTimeString()}</h1>      
          </div>
        </div>
        <EventDescription event={event} />
      </div>
    </div>
  );
}