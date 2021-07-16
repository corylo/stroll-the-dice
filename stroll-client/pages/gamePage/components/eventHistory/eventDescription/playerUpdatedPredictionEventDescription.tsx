import React from "react";

import { EventDescriptionWrapper } from "./eventDescriptionWrapper";
import { MatchupStatement } from "../../../../../components/matchupStatement/matchupStatement";
import { PlayerStatement } from "../../../../../components/playerStatement/playerStatement";
import { PointStatement } from "../../../../../components/pointStatement/pointStatement";

import { IPlayerUpdatedPredictionEvent } from "../../../../../../stroll-models/gameEvent/playerUpdatedPredictionEvent";
import { IProfileReference } from "../../../../../../stroll-models/profileReference";


interface PlayerUpdatedPredictionEventDescriptionProps {  
  event: IPlayerUpdatedPredictionEvent;
}

export const PlayerUpdatedPredictionEventDescription: React.FC<PlayerUpdatedPredictionEventDescriptionProps> = (props: PlayerUpdatedPredictionEventDescriptionProps) => {         
  const { event } = props;

  const profile: IProfileReference = event.playerID === event.matchup.left.uid
    ? event.matchup.left
    : event.matchup.right;

  const beforeAmountStatement: JSX.Element = <PointStatement amount={event.beforeAmount.toLocaleString()} />,
    afterAmountStatement: JSX.Element = <PointStatement amount={event.afterAmount.toLocaleString()} />,
    matchupStatement: JSX.Element = <MatchupStatement left={event.matchup.left} right={event.matchup.right}/>,
    playerStatement: JSX.Element = <PlayerStatement profile={profile} />;

  return (
    <EventDescriptionWrapper>
      <h1 className="player-prediction-matchup-statement passion-one-font">On matchup {matchupStatement}</h1>
      <h1 className="player-prediction-amount-statement passion-one-font">You updated your prediction of {playerStatement} from {beforeAmountStatement} to {afterAmountStatement}.</h1>
    </EventDescriptionWrapper>
  )
}