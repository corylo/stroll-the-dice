import React from "react";

import { EventDescriptionWrapper } from "./eventDescriptionWrapper";
import { MatchupStatement } from "../../../../../components/matchupStatement/matchupStatement";
import { PlayerStatement } from "../../../../../components/playerStatement/playerStatement";
import { PointStatement } from "../../../../../components/pointStatement/pointStatement";

import { IPlayerCreatedPredictionEvent } from "../../../../../../stroll-models/gameEvent/playerCreatedPredictionEvent";
import { IProfileReference } from "../../../../../../stroll-models/profileReference";

interface PlayerCreatedPredictionEventDescriptionProps {  
  event: IPlayerCreatedPredictionEvent;
}

export const PlayerCreatedPredictionEventDescription: React.FC<PlayerCreatedPredictionEventDescriptionProps> = (props: PlayerCreatedPredictionEventDescriptionProps) => {      
  const { event } = props;

  const profile: IProfileReference = event.playerID === event.matchup.left.uid
    ? event.matchup.left
    : event.matchup.right;

  const amountStatement: JSX.Element = <PointStatement amount={event.amount.toLocaleString()} />,
    matchupStatement: JSX.Element = <MatchupStatement left={event.matchup.left} right={event.matchup.right}/>,
    playerStatement: JSX.Element = <PlayerStatement profile={profile} />;

  return (
    <EventDescriptionWrapper>
      <h1 className="player-prediction-matchup-statement passion-one-font">On matchup {matchupStatement}</h1>
      <h1 className="player-prediction-amount-statement passion-one-font">You predicted {playerStatement} with {amountStatement}.</h1>
    </EventDescriptionWrapper>
  )
}