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
    predictionsPointStatement: JSX.Element = <PointStatement amount={Math.abs(event.points).toLocaleString()} />,
    sentimentStatement: string = event.points > 0 ? "Great job!" : "Better luck next time!";


  return (
    <EventDescriptionWrapper>
      <h1 className="player-day-completed-steps-statement passion-one-font">You earned {stepsPointStatement} from taking <span className="highlight-main">{event.steps.toLocaleString()}</span> steps at the end of the day!</h1>
      <h1 className="player-day-completed-predictions-statement passion-one-font">Your day {event.day} predictions {pointsText} you {predictionsPointStatement}. {sentimentStatement}</h1>
    </EventDescriptionWrapper>
  )
}