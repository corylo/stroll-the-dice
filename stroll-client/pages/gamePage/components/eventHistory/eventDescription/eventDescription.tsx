import React from "react";

import { EventUpdateDescription } from "./eventUpdateDescription";

import { IGameEvent } from "../../../../../../stroll-models/gameEvent/gameEvent";
import { IGameUpdateEvent } from "../../../../../../stroll-models/gameEvent/gameUpdateEvent";

import { GameEventType } from "../../../../../../stroll-enums/gameEventType";

interface EventDescriptionProps {  
  event: IGameEvent;
}

export const EventDescription: React.FC<EventDescriptionProps> = (props: EventDescriptionProps) => {      
  const { event } = props;

  if(event.type === GameEventType.Updated) {    
    return (
      <EventUpdateDescription event={event as IGameUpdateEvent} />
    );
  }

  return null;
}