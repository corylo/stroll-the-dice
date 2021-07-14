import React from "react";

import { Event } from "./event/event";
import { Label } from "../../../../components/label/label";

import { IGameEvent } from "../../../../../stroll-models/gameEvent/gameEvent";

interface EventGroupProps {  
  date: string;
  events: IGameEvent[];
}

export const EventGroup: React.FC<EventGroupProps> = (props: EventGroupProps) => {
  const getEvents = (): JSX.Element[] => {
    return props.events.map((event: IGameEvent) => (      
      <Event key={event.id} event={event} />      
    ));
  }

  return (
    <div className="game-event-group">
      <Label className="game-event-group-date" icon="fal fa-clock" text={props.date} />      
      <div className="game-event-group-events">
        {getEvents()}
      </div>
    </div>
  );
}