import React from "react";

interface EventDescriptionWrapperProps {  
  children: any;
}

export const EventDescriptionWrapper: React.FC<EventDescriptionWrapperProps> = (props: EventDescriptionWrapperProps) => {  
  return (
    <div className="game-event-description">
      <div className="game-event-description-indicator" />
      <div className="game-event-description-content">
        {props.children}
      </div>
    </div>
  );
}