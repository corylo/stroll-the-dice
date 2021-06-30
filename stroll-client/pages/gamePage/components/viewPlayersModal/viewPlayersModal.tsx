import React, { useContext } from "react";
import _orderBy from "lodash.orderby";

import { Leaderboard, LeaderboardSort } from "../../../../components/leaderboard/leaderboard";
import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";

import { GamePageContext } from "../../gamePage";

import { GameStatus } from "../../../../../stroll-enums/gameStatus";

interface ViewPlayersModalProps {  
  back: () => void;
}

export const ViewPlayersModal: React.FC<ViewPlayersModalProps> = (props: ViewPlayersModalProps) => {  
  const { state } = useContext(GamePageContext);

  if(state.toggles.players) {
    const getTitleText = (): string => {
      return state.game.status === GameStatus.Upcoming || state.players.length < 4
        ? "All players"
        : "Leaderboard";
    }
    
    return (
      <Modal id="view-players-modal">
        <ModalTitle text={getTitleText()} handleOnClose={props.back} />
        <ModalBody>       
          <Leaderboard 
            players={state.players} 
            sort={state.game.status === GameStatus.Upcoming ? LeaderboardSort.Alphabetical : LeaderboardSort.Funds}
          />
        </ModalBody>
      </Modal>
    );
  }

  return null;
}