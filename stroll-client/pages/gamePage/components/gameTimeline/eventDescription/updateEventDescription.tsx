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
    const beforeClause: JSX.Element = <span className="highlight-custom">{before.name}</span>,
      afterClause: JSX.Element = <span className="highlight-custom">{after.name}</span>;

    updates.push(
      <h1 key="name" className="game-event-description-clause passion-one-font">Name changed from {beforeClause} <i className="clause-arrow fal fa-long-arrow-right" /> {afterClause}</h1>
    );
  }

  if(before.duration) {
    const beforeClause: JSX.Element = <span className="highlight-custom">{before.duration}</span>,
      afterClause: JSX.Element = <span className="highlight-custom">{after.duration}</span>;

    updates.push(
      <h1 key="duration" className="game-event-description-clause passion-one-font">Duration changed from {beforeClause} <i className="clause-arrow fal fa-long-arrow-right" /> {afterClause}</h1>
    );
  }

  if(before.startsAt) {
    const beforeDateTime: string = FirestoreDateUtility.timestampToLocaleDateTime(before.startsAt),
      afterDateTime: string = FirestoreDateUtility.timestampToLocaleDateTime(after.startsAt);

    const beforeClause: JSX.Element = <span className="highlight-custom">{beforeDateTime}</span>,
      afterClause: JSX.Element = <span className="highlight-custom">{afterDateTime}</span>;

    updates.push(
      <h1 key="starts-at" className="game-event-description-clause passion-one-font">Start date changed from {beforeClause} <i className="clause-arrow fal fa-long-arrow-right" /> {afterClause}</h1>
    );
  }

  if(before.endsAt) {
    const beforeDateTime: string = FirestoreDateUtility.timestampToLocaleDateTime(before.endsAt),
      afterDateTime: string = FirestoreDateUtility.timestampToLocaleDateTime(after.endsAt);

    const beforeClause: JSX.Element = <span className="highlight-custom">{beforeDateTime}</span>,
      afterClause: JSX.Element = <span className="highlight-custom">{afterDateTime}</span>;

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