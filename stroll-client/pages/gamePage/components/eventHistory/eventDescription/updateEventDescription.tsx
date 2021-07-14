import React from "react";

import { EventDescriptionWrapper } from "./eventDescriptionWrapper";

import { FirestoreDateUtility } from "../../../../../../stroll-utilities/firestoreDateUtility";

import { IGameUpdateEvent } from "../../../../../../stroll-models/gameEvent/gameUpdateEvent";

interface UpdateEventDescriptionProps {  
  event: IGameUpdateEvent;
}

export const UpdateEventDescription: React.FC<UpdateEventDescriptionProps> = (props: UpdateEventDescriptionProps) => {      
  const { after, before } = props.event;

  let updates: JSX.Element[] = [];

  if(before.name) {
    const beforeClause: JSX.Element = <span className="highlight-main">{before.name}</span>,
      afterClause: JSX.Element = <span className="highlight-main">{after.name}</span>;

    updates.push(
      <h1 key="name" className="game-event-description-clause passion-one-font">Name changed from {beforeClause} <i className="clause-arrow fal fa-long-arrow-right" /> {afterClause}</h1>
    );
  }

  if(before.duration) {
    const beforeClause: JSX.Element = <span className="highlight-main">{before.duration}</span>,
      afterClause: JSX.Element = <span className="highlight-main">{after.duration}</span>;

    updates.push(
      <h1 key="duration" className="game-event-description-clause passion-one-font">Duration changed from {beforeClause} <i className="clause-arrow fal fa-long-arrow-right" /> {afterClause}</h1>
    );
  }

  if(before.startsAt) {
    const beforeClause: JSX.Element = <span className="highlight-main">{FirestoreDateUtility.timestampToDate(before.startsAt).toDateString()}</span>,
      afterClause: JSX.Element = <span className="highlight-main">{FirestoreDateUtility.timestampToDate(after.startsAt).toDateString()}</span>;

    updates.push(
      <h1 key="starts-at" className="game-event-description-clause passion-one-font">Start date changed from {beforeClause} <i className="clause-arrow fal fa-long-arrow-right" /> {afterClause}</h1>
    );
  }

  if(before.endsAt) {
    const beforeClause: JSX.Element = <span className="highlight-main">{FirestoreDateUtility.timestampToDate(before.endsAt).toDateString()}</span>,
      afterClause: JSX.Element = <span className="highlight-main">{FirestoreDateUtility.timestampToDate(after.endsAt).toDateString()}</span>;

    updates.push(
      <h1 key="ends-at" className="game-event-description-clause passion-one-font">End date changed from {beforeClause} <i className="clause-arrow fal fa-long-arrow-right" /> {afterClause}</h1>
    );
  }

  return (
    <EventDescriptionWrapper>
      {updates}
    </EventDescriptionWrapper>
  )
}