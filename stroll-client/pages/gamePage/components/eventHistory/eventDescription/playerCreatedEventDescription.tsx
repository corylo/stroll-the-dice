import React from "react";

import { EventDescriptionWrapper } from "./eventDescriptionWrapper";
import { UserLink } from "../../../../../components/userLink/userLink";

import { IPlayerCreatedEvent } from "../../../../../../stroll-models/gameEvent/playerCreatedEvent";


interface PlayerCreatedEventDescriptionProps {  
  event: IPlayerCreatedEvent;
}

export const PlayerCreatedEventDescription: React.FC<PlayerCreatedEventDescriptionProps> = (props: PlayerCreatedEventDescriptionProps) => {      
  return (
    <EventDescriptionWrapper>
      <UserLink profile={props.event.profile} />
    </EventDescriptionWrapper>
  )
}