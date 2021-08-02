import React from "react";
import classNames from "classnames";

import { EventDescriptionWrapper } from "./eventDescriptionWrapper";
import { PointStatement } from "../../../../../components/pointStatement/pointStatement";

import { IPlayerDayCompletedSummaryEvent } from "../../../../../../stroll-models/gameEvent/playerDayCompletedSummaryEvent";

interface SummaryRowProps {
  children: any;
  gain: boolean;
  label: string;
}

const SummaryRow: React.FC<SummaryRowProps> = (props: SummaryRowProps) => {
  return (
    <div className={classNames("player-day-completed-summary-table-row", { gain: props.gain, loss: !props.gain })}>
      <h1 className="player-day-completed-summary-table-row-label passion-one-font">{props.label}</h1>
      <div className="player-day-completed-summary-table-row-value"><i className={props.gain ? "fal fa-plus" : "fal fa-minus"} /> {props.children}</div>
    </div>
  )
}

interface PlayerDayCompletedSummaryEventDescriptionProps {  
  event: IPlayerDayCompletedSummaryEvent;
}

export const PlayerDayCompletedSummaryEventDescription: React.FC<PlayerDayCompletedSummaryEventDescriptionProps> = (props: PlayerDayCompletedSummaryEventDescriptionProps) => {      
  const { event } = props;

  if(event.overall !== undefined) {
    return (
      <EventDescriptionWrapper>
        <div className="player-day-completed-summary-table">
          <SummaryRow label="Steps" gain>
            <h1 className="passion-one-font"><PointStatement amount={event.steps.toLocaleString()} /></h1>
          </SummaryRow>
          <SummaryRow label="Won" gain>
            <h1 className="passion-one-font"><PointStatement amount={event.gained.toLocaleString()} /></h1>
          </SummaryRow>
          <SummaryRow label="Lost" gain={false}>
            <h1 className="passion-one-font"><PointStatement amount={event.lost.toLocaleString()} /></h1>
          </SummaryRow>
          <SummaryRow label="Overall" gain={event.overall >= 0}>
            <h1 className="passion-one-font"><PointStatement amount={Math.abs(event.overall).toLocaleString()} /></h1>
          </SummaryRow>
        </div>
      </EventDescriptionWrapper>
    )
  }

  return null;
}