import React from "react";

import { GameEventUtility } from "../../../../../../stroll-utilities/gameEventUtility";

import { GameEventType } from "../../../../../../stroll-enums/gameEventType";

interface EventTypeProps {  
  type: GameEventType;
}

export const EventType: React.FC<EventTypeProps> = (props: EventTypeProps) => {        
  const backgroundColor: string = `rgba(${GameEventUtility.getColor(props.type)}, 0.5)`,
    label: string = GameEventUtility.getLabel(props.type);

  return (
    <div className="game-event-type">
      <h1 className="passion-one-font" style={{ backgroundColor }}>{label}</h1>
    </div>
  );
}