import React from "react";

import { EventDescriptionWrapper } from "./eventDescriptionWrapper";
import { PointStatement } from "../../../../../components/pointStatement/pointStatement";

import { IPlayerUpdatedPredictionEvent } from "../../../../../../stroll-models/gameEvent/playerUpdatedPredictionEvent";


interface PlayerUpdatedPredictionEventDescriptionProps {  
  event: IPlayerUpdatedPredictionEvent;
}

export const PlayerUpdatedPredictionEventDescription: React.FC<PlayerUpdatedPredictionEventDescriptionProps> = (props: PlayerUpdatedPredictionEventDescriptionProps) => {      
  const beforeAmountStatement: JSX.Element = <PointStatement amount={props.event.beforeAmount.toLocaleString()} />,
    afterAmountStatement: JSX.Element = <PointStatement amount={props.event.afterAmount.toLocaleString()} />;

  return (
    <EventDescriptionWrapper>
      <h1 className="player-updated-prediction-statement passion-one-font">You updated your prediction from {beforeAmountStatement} to {afterAmountStatement}.</h1>
    </EventDescriptionWrapper>
  )
}