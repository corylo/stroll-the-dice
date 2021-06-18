import React, { useContext } from "react";

import { GameForm } from "../../../../components/gameForm/gameForm";
import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";

import { GamePageContext } from "../../gamePage";

import { useOnClickAwayEffect } from "../../../../effects/appEffects";

import { GameService } from "../../../../services/gameService";

import { GameFormUtility } from "../../../../components/gameForm/utilities/gameFormUtility";

import { IGameFormStateFields } from "../../../../components/gameForm/models/gameFormStateFields";
import { IGameUpdate } from "../../../../../stroll-models/gameUpdate";

import { ElementID } from "../../../../enums/elementId";

interface UpdateGameModalProps {  
  back: () => void;
}

export const UpdateGameModal: React.FC<UpdateGameModalProps> = (props: UpdateGameModalProps) => {  
  const { state, setState } = useContext(GamePageContext);

  useOnClickAwayEffect(
    state.toggles.update, 
    ["update-game-modal-content"], 
    [state.toggles.update, state.status], 
    props.back
  );

  if(state.toggles.update) {
    const updateGame = async (fields: IGameFormStateFields): Promise<void> => {    
      const update: IGameUpdate = GameFormUtility.mapUpdate(fields);
      
      await GameService.update(state.game.id, update);
  
      setState({ 
        ...state, 
        game: { ...state.game, ...update } 
      });
    }

    return (
      <Modal id={ElementID.UpdateGameModal} status={state.status} priority>
        <ModalTitle text="Update Game" handleOnClose={props.back} />
        <ModalBody>
          <GameForm 
            game={state.game} 
            gameStatus={state.gameStatus}
            back={props.back} 
            save={updateGame} 
          />
        </ModalBody>
      </Modal>
    );
  }

  return null;
}