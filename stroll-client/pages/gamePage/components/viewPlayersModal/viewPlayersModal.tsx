import React, { useContext } from "react";

import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";
import { UserLink } from "../../../../components/userLink/userLink";

import { GamePageContext } from "../../gamePage";

import { IPlayer } from "../../../../../stroll-models/player";

interface ViewPlayersModalProps {  
  back: () => void;
}

export const ViewPlayersModal: React.FC<ViewPlayersModalProps> = (props: ViewPlayersModalProps) => {  
  const { state } = useContext(GamePageContext);

  if(state.toggles.players) {
    const getPlayers = (): JSX.Element => {
      const players: JSX.Element[] = state.players.map((player: IPlayer) => 
        <UserLink key={player.id} profile={player.profile} />);

      return (
        <div className="player-list">
          {players}
        </div>
      )
    }
    
    
    return (
      <Modal id="view-players-modal">
        <ModalTitle text="All players" handleOnClose={props.back} />
        <ModalBody>       
          {getPlayers()}   
        </ModalBody>
      </Modal>
    );
  }

  return null;
}