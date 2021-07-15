import React from "react";

import { EventDescriptionWrapper } from "./eventDescriptionWrapper";
import { MatchupStatement } from "../../../../../components/matchupStatement/matchupStatement";
import { PointStatement } from "../../../../../components/pointStatement/pointStatement";

import { IPlayerUpdatedPredictionEvent } from "../../../../../../stroll-models/gameEvent/playerUpdatedPredictionEvent";


interface PlayerUpdatedPredictionEventDescriptionProps {  
  event: IPlayerUpdatedPredictionEvent;
}

export const PlayerUpdatedPredictionEventDescription: React.FC<PlayerUpdatedPredictionEventDescriptionProps> = (props: PlayerUpdatedPredictionEventDescriptionProps) => {         
  const { event } = props;

  const beforeAmountStatement: JSX.Element = <PointStatement amount={event.beforeAmount.toLocaleString()} />,
    afterAmountStatement: JSX.Element = <PointStatement amount={event.afterAmount.toLocaleString()} />,
    matchupStatement: JSX.Element = <MatchupStatement left={event.matchup.left} right={event.matchup.right}/>;

  return (
    <EventDescriptionWrapper>
      <h1 className="player-prediction-matchup-statement passion-one-font">On matchup {matchupStatement}</h1>
      <h1 className="player-prediction-amount-statement passion-one-font">You updated your prediction from {beforeAmountStatement} to {afterAmountStatement}.</h1>
    </EventDescriptionWrapper>
  )
}