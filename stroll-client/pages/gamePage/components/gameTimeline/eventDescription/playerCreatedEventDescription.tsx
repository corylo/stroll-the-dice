import React, { useContext } from "react";

import { EventDescriptionWrapper } from "./eventDescriptionWrapper";
import { UserLink } from "../../../../../components/userLink/userLink";

import { GamePageContext } from "../../../gamePage";

import { PlayerUtility } from "../../../../../utilities/playerUtility";

import { IPlayerCreatedEvent } from "../../../../../../stroll-models/gameEvent/playerCreatedEvent";
import { IPlayer } from "../../../../../../stroll-models/player";

interface PlayerCreatedEventDescriptionProps {  
  event: IPlayerCreatedEvent;
}

export const PlayerCreatedEventDescription: React.FC<PlayerCreatedEventDescriptionProps> = (props: PlayerCreatedEventDescriptionProps) => {
  const { state } = useContext(GamePageContext);
  
  const player: IPlayer = PlayerUtility.getById(props.event.playerID, state.players);

  return (
    <EventDescriptionWrapper>
      <UserLink profile={player.profile} />
    </EventDescriptionWrapper>
  )
}