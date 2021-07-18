import React, { useContext } from "react";

import { EventHistory } from "../eventHistory/eventHistory";
import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";

import { GamePageContext } from "../../gamePage";

interface ViewEventsModalProps {  
  back: () => void;
}

export const ViewEventsModal: React.FC<ViewEventsModalProps> = (props: ViewEventsModalProps) => {  
  const { state } = useContext(GamePageContext);

  const { events, statuses, toggles } = state;

  if(toggles.events) {
    return (
      <Modal id="view-events-modal" status={statuses.events}>
        <ModalTitle text="Game Timeline" handleOnClose={props.back} />
        <ModalBody>       
          <EventHistory events={events} />
        </ModalBody>
      </Modal>
    );
  }

  return null;
}