import React, { useContext } from "react";

import { EventFilters } from "../eventHistory/eventFilters/eventFilters";
import { EventHistory } from "../eventHistory/eventHistory";
import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";

import { GamePageContext } from "../../gamePage";

import { useOnClickAwayEffect } from "../../../../effects/appEffects";

interface ViewEventsModalProps {  
  back: () => void;
}

export const ViewEventsModal: React.FC<ViewEventsModalProps> = (props: ViewEventsModalProps) => {  
  const { state } = useContext(GamePageContext);

  const { statuses, toggles } = state;

  useOnClickAwayEffect(
    toggles.events, 
    ["view-events-modal-content"], 
    [toggles.events, statuses.events], 
    props.back
  );

  if(toggles.events) {
    return (
      <Modal id="view-events-modal" status={statuses.events}>
        <ModalTitle text="Game Timeline" handleOnClose={props.back} />
        <ModalBody>       
          <EventFilters />
          <EventHistory />
        </ModalBody>
      </Modal>
    );
  }

  return null;
}