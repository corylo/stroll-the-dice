import React, { useContext, useState } from "react";

import { EventHistory } from "../eventHistory/eventHistory";
import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";

import { GamePageContext } from "../../gamePage";

import { useEventListenerEffect } from "../../effects/gamePageListenerEffects";

import { IViewEventsModalState } from "../../models/viewEventsModalState";

import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface ViewEventsModalProps {  
  back: () => void;
}

export const ViewEventsModal: React.FC<ViewEventsModalProps> = (props: ViewEventsModalProps) => {  
  const { state: gameState } = useContext(GamePageContext);

  const { game, player } = gameState;

  const [state, setState] = useState<IViewEventsModalState>({ events: [], status: RequestStatus.Loading });

  useEventListenerEffect(game.id, player.id, state, setState);

  return (
    <Modal id="view-events-modal" status={state.status}>
      <ModalTitle text="Game Timeline" handleOnClose={props.back} />
      <ModalBody>       
        <EventHistory events={state.events} />
      </ModalBody>
    </Modal>
  );
}