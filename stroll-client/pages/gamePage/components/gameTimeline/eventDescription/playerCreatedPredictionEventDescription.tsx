import React, { useContext } from "react";

import { EventDescriptionWrapper } from "./eventDescriptionWrapper";
import { MatchupStatement } from "../../../../../components/matchupStatement/matchupStatement";
import { PlayerStatement } from "../../../../../components/playerStatement/playerStatement";
import { PointStatement } from "../../../../../components/pointStatement/pointStatement";

import { GamePageContext } from "../../../gamePage";

import { PlayerUtility } from "../../../../../utilities/playerUtility";

import { IPlayer } from "../../../../../../stroll-models/player";
import { IPlayerCreatedPredictionEvent } from "../../../../../../stroll-models/gameEvent/playerCreatedPredictionEvent";
import { IProfileReference } from "../../../../../../stroll-models/profileReference";

interface PlayerCreatedPredictionEventDescriptionProps {  
  event: IPlayerCreatedPredictionEvent;
}

export const PlayerCreatedPredictionEventDescription: React.FC<PlayerCreatedPredictionEventDescriptionProps> = (props: PlayerCreatedPredictionEventDescriptionProps) => {      
  const { state } = useContext(GamePageContext);

  const { event } = props;

  const leftPlayer: IPlayer = PlayerUtility.getById(event.matchup.leftPlayerID, state.players),
    rightPlayer: IPlayer = PlayerUtility.getById(event.matchup.rightPlayerID, state.players);

    const profile: IProfileReference = event.playerID === event.matchup.leftPlayerID
    ? leftPlayer.profile
    : rightPlayer.profile;

  const amountStatement: JSX.Element = <PointStatement amount={event.amount.toLocaleString()} />,
    matchupStatement: JSX.Element = <MatchupStatement left={leftPlayer.profile} right={rightPlayer.profile}/>,
    playerStatement: JSX.Element = <PlayerStatement profile={profile} />;

  return (
    <EventDescriptionWrapper>
      <h1 className="player-prediction-matchup-statement passion-one-font">On matchup {matchupStatement}</h1>
      <h1 className="player-prediction-amount-statement passion-one-font">You predicted {playerStatement} with {amountStatement}.</h1>
    </EventDescriptionWrapper>
  )
}