import React from "react";

import { EventDescriptionWrapper } from "./eventDescriptionWrapper";
import { PointStatement } from "../../../../../components/pointStatement/pointStatement";

import { IPlayerEarnedPointsFromStepsEvent } from "../../../../../../stroll-models/gameEvent/playerEarnedPointsFromStepsEvent";


interface PlayerEarnedPointsFromStepsEventDescriptionProps {  
  event: IPlayerEarnedPointsFromStepsEvent;
}

export const PlayerEarnedPointsFromStepsEventDescription: React.FC<PlayerEarnedPointsFromStepsEventDescriptionProps> = (props: PlayerEarnedPointsFromStepsEventDescriptionProps) => {      
  const pointStatement: JSX.Element = <PointStatement amount={props.event.points.toLocaleString()} />;

  return (
    <EventDescriptionWrapper>
      <h1 className="player-earned-points-from-steps passion-one-font">You earned {pointStatement} from taking {props.event.points.toLocaleString()} steps!</h1>
    </EventDescriptionWrapper>
  )
}