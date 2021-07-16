import React, { useContext } from "react";

import { Leaderboard } from "../../../../components/leaderboard/leaderboard";
import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";

import { GamePageContext } from "../../gamePage";

interface ViewPlayersModalProps {  
  back: () => void;
}

export const ViewPlayersModal: React.FC<ViewPlayersModalProps> = (props: ViewPlayersModalProps) => {  
  const { state } = useContext(GamePageContext);

  if(state.toggles.players) {
    return (
      <Modal id="view-players-modal">
        <ModalTitle handleOnClose={props.back} />
        <ModalBody>       
          <Leaderboard players={state.players} gameStatus={state.game.status} />
        </ModalBody>
      </Modal>
    );
  }

  return null;
}