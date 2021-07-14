import React, { useContext } from "react";

import { ViewEventsModal } from "./viewEventsModal";

import { GamePageContext } from "../../gamePage";

interface ViewEventsModalWrapperProps {  
  back: () => void;
}

export const ViewEventsModalWrapper: React.FC<ViewEventsModalWrapperProps> = (props: ViewEventsModalWrapperProps) => {  
  const { state } = useContext(GamePageContext);

  if(state.toggles.events) {
    return (
      <ViewEventsModal back={props.back} />
    );
  }

  return null;
}