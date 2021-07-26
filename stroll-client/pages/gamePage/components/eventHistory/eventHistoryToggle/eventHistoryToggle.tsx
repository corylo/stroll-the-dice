import React, { useContext } from "react";

import { Button } from "../../../../../components/buttons/button";

import { GamePageContext } from "../../../gamePage";

import { GameEventUtility } from "../../../../../../stroll-utilities/gameEventUtility";

interface EventHistoryToggleProps {  
  toggle: (updates: any) => void;
}

export const EventHistoryToggle: React.FC<EventHistoryToggleProps> = (props: EventHistoryToggleProps) => {  
  const { state } = useContext(GamePageContext);

  const handleOnClick = (): void => {
    props.toggle({ events: true });
  }

  return (
    <Button className="event-history-toggle" handleOnClick={handleOnClick}>
      <i className="fal fa-history" />
      <h1 className="passion-one-font">Timeline</h1>                   
    </Button>
  )
}