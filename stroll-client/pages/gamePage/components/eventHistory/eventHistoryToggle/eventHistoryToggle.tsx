import React, { useContext } from "react";

import { Button } from "../../../../../components/buttons/button";

import { GamePageContext } from "../../../gamePage";

import { GameEventUtility } from "../../../../../../stroll-utilities/gameEventUtility";

interface EventHistoryToggleProps {  
  toggle: (updates: any) => void;
}

export const EventHistoryToggle: React.FC<EventHistoryToggleProps> = (props: EventHistoryToggleProps) => {  
  const { state } = useContext(GamePageContext);

  const getNumberOfUnviewed = (): JSX.Element => {
    const unviewed: number = GameEventUtility.getNumberOfUnviewedEvents(state.events);

    if(unviewed > 0) {
      const icon: JSX.Element = unviewed >= 5 ? <i className="fas fa-plus" /> : null;

      return (
        <span className="highlight-main">{unviewed} {icon}</span>
      )
    }
  }

  return (
    <Button className="event-history-toggle" handleOnClick={() => props.toggle({ events: true })}>
      <i className="fal fa-history" />
      <h1 className="passion-one-font">Timeline {getNumberOfUnviewed()}</h1>                   
    </Button>
  )
}