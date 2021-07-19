import React from "react";

import { EventDescriptionWrapper } from "./eventDescriptionWrapper";
import { PointStatement } from "../../../../../components/pointStatement/pointStatement";

import { IPlayerDayCompletedSummaryEvent } from "../../../../../../stroll-models/gameEvent/playerDayCompletedSummaryEvent";

interface SummaryRowProps {
  children: any;
  label: string;
}

const SummaryRow: React.FC<SummaryRowProps> = (props: SummaryRowProps) => {
  return (
    <div className="player-day-completed-summary-table-row">
      <h1 className="player-day-completed-summary-table-row-label passion-one-font">{props.label}</h1>
      <div className="player-day-completed-summary-table-row-value">{props.children}</div>
    </div>
  )
}

interface PlayerDayCompletedSummaryEventDescriptionProps {  
  event: IPlayerDayCompletedSummaryEvent;
}

export const PlayerDayCompletedSummaryEventDescription: React.FC<PlayerDayCompletedSummaryEventDescriptionProps> = (props: PlayerDayCompletedSummaryEventDescriptionProps) => {      
  const { event } = props;

  if(event.overall !== undefined) {
    const overallLabel: string = event.overall >= 0 ? "Gain of " : "Loss of ";

    return (
      <EventDescriptionWrapper>
        <div className="player-day-completed-summary-table">
          <SummaryRow label="Total Points From Stepping">
            <h1 className="passion-one-font"><PointStatement amount={event.steps.toLocaleString()} /></h1>
          </SummaryRow>
          <SummaryRow label="Total Wagered">
            <h1 className="passion-one-font"><PointStatement amount={event.wagered.toLocaleString()} /></h1>
          </SummaryRow>
          <SummaryRow label="Total Gained">
            <h1 className="passion-one-font"><PointStatement amount={event.gained.toLocaleString()} /></h1>
          </SummaryRow>
          <SummaryRow label="Total Lost">
            <h1 className="passion-one-font"><PointStatement amount={event.lost.toLocaleString()} /></h1>
          </SummaryRow>
          <SummaryRow label="Overall">
            <h1 className="passion-one-font">{overallLabel} <PointStatement amount={Math.abs(event.overall).toLocaleString()} /></h1>
          </SummaryRow>
        </div>
      </EventDescriptionWrapper>
    )
  }

  return null;
}