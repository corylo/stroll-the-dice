import React from "react";

import { EventDescriptionWrapper } from "./eventDescriptionWrapper";
import { PointStatement } from "../../../../../components/pointStatement/pointStatement";

import { IPlayerCreatedPredictionEvent } from "../../../../../../stroll-models/gameEvent/playerCreatedPredictionEvent";


interface PlayerCreatedPredictionEventDescriptionProps {  
  event: IPlayerCreatedPredictionEvent;
}

export const PlayerCreatedPredictionEventDescription: React.FC<PlayerCreatedPredictionEventDescriptionProps> = (props: PlayerCreatedPredictionEventDescriptionProps) => {      
  const amountStatement: JSX.Element = <PointStatement amount={props.event.amount.toLocaleString()} />;

  return (
    <EventDescriptionWrapper>
      <h1 className="player-created-prediction-statement passion-one-font">You predicted {amountStatement}.</h1>
    </EventDescriptionWrapper>
  )
}