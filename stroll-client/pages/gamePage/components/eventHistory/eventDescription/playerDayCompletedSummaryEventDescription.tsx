import React from "react";

import { EventDescriptionWrapper } from "./eventDescriptionWrapper";
import { PointStatement } from "../../../../../components/pointStatement/pointStatement";

import { IPlayerDayCompletedSummaryEvent } from "../../../../../../stroll-models/gameEvent/playerDayCompletedSummaryEvent";


interface PlayerDayCompletedSummaryEventDescriptionProps {  
  event: IPlayerDayCompletedSummaryEvent;
}

export const PlayerDayCompletedSummaryEventDescription: React.FC<PlayerDayCompletedSummaryEventDescriptionProps> = (props: PlayerDayCompletedSummaryEventDescriptionProps) => {      
  const { event } = props;

  const pointsText: string = event.points >= 0 ? "earned" : "lost",
    stepsPointStatement: JSX.Element = <PointStatement amount={event.steps.toLocaleString()} />,
    predictionsPointStatement: JSX.Element = <PointStatement amount={event.points.toLocaleString()} />;


  return (
    <EventDescriptionWrapper>
      <h1 className="player-day-completed-summary-statement passion-one-font">You earned {stepsPointStatement} from taking {props.event.steps.toLocaleString()} steps!</h1>
      <h1 className="player-day-completed-summary-statement passion-one-font">You {pointsText} a total of {predictionsPointStatement} from your predictions today.</h1>
    </EventDescriptionWrapper>
  )
}