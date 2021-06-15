import React from "react";

import { GameForm } from "../../../../components/gameForm/gameForm";
import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";

import { useOnClickAwayEffect } from "../../../../effects/appEffects";

import { IGame } from "../../../../../stroll-models/game";
import { IGamePageState } from "../../models/gamePageState";

import { ElementID } from "../../../../enums/elementId";

interface UpdateGameModalProps {  
  state: IGamePageState;
  cancel: () => void;
  update: (game: IGame) => Promise<void>;
}

export const UpdateGameModal: React.FC<UpdateGameModalProps> = (props: UpdateGameModalProps) => {  
  const { state, cancel, update } = props;

  useOnClickAwayEffect(
    state.toggles.update, 
    ["update-game-modal-content"], 
    [state.toggles.update, state.status], 
    cancel
  );

  if(state.toggles.update) {
    return (
      <Modal id={ElementID.UpdateGameModal} status={state.status} priority>
        <ModalTitle text="Update Game" handleOnClose={cancel} />
        <ModalBody>
          <GameForm game={state.game} back={cancel} save={update} />
        </ModalBody>
      </Modal>
    );
  }

  return null;
}