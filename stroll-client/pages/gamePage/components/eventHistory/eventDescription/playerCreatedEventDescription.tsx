import React from "react";

import { IPlayerCreatedEvent } from "../../../../../../stroll-models/gameEvent/playerCreatedEvent";
import { UserLink } from "../../../../../components/userLink/userLink";

interface PlayerCreatedEventDescriptionProps {  
  event: IPlayerCreatedEvent;
}

export const PlayerCreatedEventDescription: React.FC<PlayerCreatedEventDescriptionProps> = (props: PlayerCreatedEventDescriptionProps) => {      
  return (
    <div className="game-event-description">
      <UserLink profile={props.event.profile} />
    </div>
  )
}