import React, { useContext, useState } from "react";

import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";
import { UserLink } from "../../../../components/userLink/userLink";

import { GamePageContext } from "../../gamePage";

import { useOnClickAwayEffect } from "../../../../effects/appEffects";
import { useFetchPlayersEffect } from "../../effects/gamePageEffects";

import { IPlayer } from "../../../../../stroll-models/player";

import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface ViewPlayersModalProps {  
  back: () => void;
}

export const ViewPlayersModal: React.FC<ViewPlayersModalProps> = (props: ViewPlayersModalProps) => {  
  const { state, setState } = useContext(GamePageContext);

  const [status, setStatus] = useState<RequestStatus>(RequestStatus.Idle);

  useOnClickAwayEffect(
    state.toggles.players, 
    ["view-players-modal-content"], 
    [state.toggles.players, status], 
    props.back
  );

  useFetchPlayersEffect(state, setState, setStatus);

  if(state.toggles.players) {
    const getPlayers = (): JSX.Element => {
      const players: JSX.Element[] = [...state.players, ...state.players, ...state.players, ...state.players, ...state.players, ...state.players, ...state.players, ...state.players].map((player: IPlayer) => 
        <UserLink key={player.id} profile={player.profile} />);

      return (
        <div className="player-list">
          {players}
        </div>
      )
    }
    
    
    return (
      <Modal id="view-players-modal" priority status={status}>
        <ModalTitle text="All players" handleOnClose={props.back} />
        <ModalBody>       
          {getPlayers()}   
        </ModalBody>
      </Modal>
    );
  }

  return null;
}