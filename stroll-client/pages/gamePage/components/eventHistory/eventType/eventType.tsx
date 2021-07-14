import React from "react";

import { GameEventUtility } from "../../../../../../stroll-utilities/gameEventUtility";

import { GameEventType } from "../../../../../../stroll-enums/gameEventType";

interface EventTypeProps {  
  type: GameEventType;
}

export const EventType: React.FC<EventTypeProps> = (props: EventTypeProps) => {        
  const label: string = GameEventUtility.getLabel(props.type);

  return (
    <div className="game-event-type">
      <h1 className="passion-one-font">{label}</h1>
    </div>
  );
}