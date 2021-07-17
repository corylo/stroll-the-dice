import React from "react";

import { GameEventUtility } from "../../../../../../stroll-utilities/gameEventUtility";

import { IGameEvent } from "../../../../../../stroll-models/gameEvent/gameEvent";

interface EventTypeProps {  
  event: IGameEvent;
}

export const EventType: React.FC<EventTypeProps> = (props: EventTypeProps) => {        
  const label: string = GameEventUtility.getLabel(props.event);

  return (
    <div className="game-event-type">
      <h1 className="passion-one-font">{label}</h1>
    </div>
  );
}