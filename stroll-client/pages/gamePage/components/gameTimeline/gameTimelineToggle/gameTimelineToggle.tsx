import React from "react";

import { Button } from "../../../../../components/buttons/button";

interface GameTimelineToggleProps {  
  toggle: (updates: any) => void;
}

export const GameTimelineToggle: React.FC<GameTimelineToggleProps> = (props: GameTimelineToggleProps) => {
  const handleOnClick = (): void => {
    props.toggle({ events: true });
  }

  return (
    <Button className="game-action-toggle" handleOnClick={handleOnClick}>
      <i className="fal fa-history" />
      <h1 className="passion-one-font">Timeline</h1>                   
    </Button>
  )
}