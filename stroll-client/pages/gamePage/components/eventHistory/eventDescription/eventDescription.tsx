import React from "react";

import { PlayerCreatedEventDescription } from "./playerCreatedEventDescription";
import { PlayerEarnedPointsFromStepsEventDescription } from "./playerEarnedPointsFromStepsEventDescription";
import { UpdateEventDescription } from "./updateEventDescription";

import { IGameEvent } from "../../../../../../stroll-models/gameEvent/gameEvent";
import { IGameUpdateEvent } from "../../../../../../stroll-models/gameEvent/gameUpdateEvent";
import { IPlayerCreatedEvent } from "../../../../../../stroll-models/gameEvent/playerCreatedEvent";
import { IPlayerEarnedPointsFromStepsEvent } from "../../../../../../stroll-models/gameEvent/playerEarnedPointsFromStepsEvent";

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
  } else if (event.type === GameEventType.PlayerEarnedPointsFromSteps)  {
    return (
      <PlayerEarnedPointsFromStepsEventDescription event={event as IPlayerEarnedPointsFromStepsEvent} />
    )
  }

  return null;
}