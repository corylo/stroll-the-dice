import React from "react";

import { PlayerCreatedEventDescription } from "./playerCreatedEventDescription";
import { PlayerCreatedPredictionEventDescription } from "./playerCreatedPredictionEventDescription";
import { PlayerEarnedPointsFromStepsEventDescription } from "./playerEarnedPointsFromStepsEventDescription";
import { PlayerUpdatedPredictionEventDescription } from "./playerUpdatedPredictionEventDescription";
import { UpdateEventDescription } from "./updateEventDescription";

import { IGameEvent } from "../../../../../../stroll-models/gameEvent/gameEvent";
import { IGameUpdateEvent } from "../../../../../../stroll-models/gameEvent/gameUpdateEvent";
import { IPlayerCreatedEvent } from "../../../../../../stroll-models/gameEvent/playerCreatedEvent";
import { IPlayerCreatedPredictionEvent } from "../../../../../../stroll-models/gameEvent/playerCreatedPredictionEvent";
import { IPlayerEarnedPointsFromStepsEvent } from "../../../../../../stroll-models/gameEvent/playerEarnedPointsFromStepsEvent";
import { IPlayerUpdatedPredictionEvent } from "../../../../../../stroll-models/gameEvent/playerUpdatedPredictionEvent";

import { GameEventType } from "../../../../../../stroll-enums/gameEventType";

interface EventDescriptionProps {  
  event: IGameEvent;
}

export const EventDescription: React.FC<EventDescriptionProps> = (props: EventDescriptionProps) => {      
  const { event } = props;

  switch(event.type) {
    case GameEventType.Updated:
      return (
        <UpdateEventDescription event={event as IGameUpdateEvent} />
      );
    case GameEventType.PlayerCreated:
      return (
        <PlayerCreatedEventDescription event={event as IPlayerCreatedEvent} />
      );
    case GameEventType.PlayerCreatedPrediction:
      return (
        <PlayerCreatedPredictionEventDescription event={event as IPlayerCreatedPredictionEvent} />
      );
    case GameEventType.PlayerEarnedPointsFromSteps:
      return (
        <PlayerEarnedPointsFromStepsEventDescription event={event as IPlayerEarnedPointsFromStepsEvent} />
      );
    case GameEventType.PlayerUpdatedPrediction:
      return (
        <PlayerUpdatedPredictionEventDescription event={event as IPlayerUpdatedPredictionEvent} />
      );
    default:
      return null;
  }
}