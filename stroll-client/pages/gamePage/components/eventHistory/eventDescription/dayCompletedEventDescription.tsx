import React from "react";

import { EventDescriptionWrapper } from "./eventDescriptionWrapper";

import { IDayCompletedEvent } from "../../../../../../stroll-models/gameEvent/dayCompletedEvent";


interface DayCompletedEventDescriptionProps {  
  event: IDayCompletedEvent;
}

export const DayCompletedEventDescription: React.FC<DayCompletedEventDescriptionProps> = (props: DayCompletedEventDescriptionProps) => {      
  return (
    <EventDescriptionWrapper>
      <h1 className="day-completed-statement passion-one-font">Day {props.event.day} complete!</h1>
    </EventDescriptionWrapper>
  )
}