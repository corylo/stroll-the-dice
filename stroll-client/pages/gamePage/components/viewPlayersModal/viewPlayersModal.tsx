import React, { useContext } from "react";

import { Leaderboard } from "../../../../components/leaderboard/leaderboard";
import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";

import { GamePageContext } from "../../gamePage";

import { useOnClickAwayEffect } from "../../../../effects/appEffects";

interface ViewPlayersModalProps {  
  back: () => void;
}

export const ViewPlayersModal: React.FC<ViewPlayersModalProps> = (props: ViewPlayersModalProps) => {  
  const { state } = useContext(GamePageContext);

  useOnClickAwayEffect(
    state.toggles.players, 
    ["view-players-modal-content"], 
    [state.toggles.players], 
    props.back
  );

  if(state.toggles.players) {
    return (
      <Modal id="view-players-modal">
        <ModalTitle handleOnClose={props.back} />
        <ModalBody>       
          <Leaderboard 
            gameStatus={state.game.status}
            id="view-players-modal-leaderboard" 
            players={state.players} 
          />
        </ModalBody>
      </Modal>
    );
  }

  return null;
}