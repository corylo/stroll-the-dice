import React, { useContext } from "react";

import { EventHistory } from "../eventHistory/eventHistory";
import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";

import { GamePageContext } from "../../gamePage";
import { EventFilters } from "../eventHistory/eventFilters/eventFilters";

interface ViewEventsModalProps {  
  back: () => void;
}

export const ViewEventsModal: React.FC<ViewEventsModalProps> = (props: ViewEventsModalProps) => {  
  const { state } = useContext(GamePageContext);

  const { statuses, toggles } = state;

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