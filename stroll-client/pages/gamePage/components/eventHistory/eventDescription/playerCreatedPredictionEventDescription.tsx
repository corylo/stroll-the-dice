import React from "react";

import { EventDescriptionWrapper } from "./eventDescriptionWrapper";
import { MatchupStatement } from "../../../../../components/matchupStatement/matchupStatement";
import { PointStatement } from "../../../../../components/pointStatement/pointStatement";

import { IPlayerCreatedPredictionEvent } from "../../../../../../stroll-models/gameEvent/playerCreatedPredictionEvent";

interface PlayerCreatedPredictionEventDescriptionProps {  
  event: IPlayerCreatedPredictionEvent;
}

export const PlayerCreatedPredictionEventDescription: React.FC<PlayerCreatedPredictionEventDescriptionProps> = (props: PlayerCreatedPredictionEventDescriptionProps) => {      
  const { event } = props;

  const amountStatement: JSX.Element = <PointStatement amount={event.amount.toLocaleString()} />,
    matchupStatement: JSX.Element = <MatchupStatement left={event.matchup.left} right={event.matchup.right}/>;

  return (
    <EventDescriptionWrapper>
      <h1 className="player-prediction-matchup-statement passion-one-font">On matchup {matchupStatement}</h1>
      <h1 className="player-prediction-amount-statement passion-one-font">You predicted {amountStatement}.</h1>
    </EventDescriptionWrapper>
  )
}