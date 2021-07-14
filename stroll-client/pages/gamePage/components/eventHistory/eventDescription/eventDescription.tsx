import React from "react";

import { PlayerCreatedEventDescription } from "./playerCreatedEventDescription";
import { UpdateEventDescription } from "./updateEventDescription";

import { IGameEvent } from "../../../../../../stroll-models/gameEvent/gameEvent";
import { IGameUpdateEvent } from "../../../../../../stroll-models/gameEvent/gameUpdateEvent";
import { IPlayerCreatedEvent } from "../../../../../../stroll-models/gameEvent/playerCreatedEvent";

import { GameEventType } from "../../../../../../stroll-enums/gameEventType";

interface EventDescriptionProps {  
  event: IGameEvent;
}

export const EventDescription: React.FC<EventDescriptionProps> = (props: EventDescriptionProps) => {      
  const { event } = props;

  if(event.type === GameEventType.Updated) {    
    return (
      <UpdateEventDescription event={event as IGameUpdateEvent} />
    );
  } else if (event.type === GameEventType.PlayerCreated) {
    return (
      <PlayerCreatedEventDescription event={event as IPlayerCreatedEvent} />
    )
  }

  return null;
}