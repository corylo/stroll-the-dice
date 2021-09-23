import React, { useContext } from "react";

import { EventDescriptionWrapper } from "./eventDescriptionWrapper";
import { MatchupStatement } from "../../../../../components/matchupStatement/matchupStatement";
import { PlayerStatement } from "../../../../../components/playerStatement/playerStatement";
import { PointStatement } from "../../../../../components/pointStatement/pointStatement";

import { GamePageContext } from "../../../gamePage";

import { PlayerUtility } from "../../../../../utilities/playerUtility";

import { IPlayer } from "../../../../../../stroll-models/player";
import { IPlayerUpdatedPredictionEvent } from "../../../../../../stroll-models/gameEvent/playerUpdatedPredictionEvent";
import { IProfileReference } from "../../../../../../stroll-models/profileReference";


interface PlayerUpdatedPredictionEventDescriptionProps {  
  event: IPlayerUpdatedPredictionEvent;
}

export const PlayerUpdatedPredictionEventDescription: React.FC<PlayerUpdatedPredictionEventDescriptionProps> = (props: PlayerUpdatedPredictionEventDescriptionProps) => {         
  const { state } = useContext(GamePageContext);

  const { event } = props;

  const leftPlayer: IPlayer = PlayerUtility.getById(event.matchup.leftPlayerID, state.players),
    rightPlayer: IPlayer = PlayerUtility.getById(event.matchup.rightPlayerID, state.players);

  const profile: IProfileReference = event.playerID === event.matchup.leftPlayerID
    ? leftPlayer.profile
    : rightPlayer.profile;

  const beforeAmountStatement: JSX.Element = <PointStatement amount={event.beforeAmount.toLocaleString()} />,
    afterAmountStatement: JSX.Element = <PointStatement amount={event.afterAmount.toLocaleString()} />,
    matchupStatement: JSX.Element = <MatchupStatement left={leftPlayer.profile} right={rightPlayer.profile}/>,
    playerStatement: JSX.Element = <PlayerStatement profile={profile} />;

  const getPredictionAmountStatement = (): JSX.Element => {
    if(event.refundedAt) {
      return (
        <h1 className="player-prediction-amount-statement passion-one-font">Your prediction of {afterAmountStatement} on {playerStatement} was refunded.</h1>
      )
    }

    return (
      <h1 className="player-prediction-amount-statement passion-one-font">You updated your prediction of {playerStatement} from {beforeAmountStatement} to {afterAmountStatement}.</h1>
    )
  }

  return (
    <EventDescriptionWrapper>
      <h1 className="player-prediction-matchup-statement passion-one-font">On matchup {matchupStatement}</h1>
      {getPredictionAmountStatement()}
    </EventDescriptionWrapper>
  )
}