import React from "react";

import { GameActions } from "../gameActions/gameActions";
import { GameDetails } from "../../../../components/gameDetails/gameDetails";
import { UpdateGameModal } from "../updateGameModal/updateGameModal";

import { GameService } from "../../../../services/gameService";

import { GameFormUtility } from "../../../../components/gameForm/utilities/gameFormUtility";

import { IGameFormStateFields } from "../../../../components/gameForm/models/gameFormStateFields";
import { IGamePageState } from "../../models/gamePageState";
import { IGameUpdate } from "../../../../../stroll-models/gameUpdate";

import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface GamePageContentProps {
  state: IGamePageState;
  setState: (state: IGamePageState) => void;
}

export const GamePageContent: React.FC<GamePageContentProps> = (props: GamePageContentProps) => {
  const { game, invite, status, toggles } = props.state;
  
  if(status === RequestStatus.Success && game !== null) {
    const toggle = (update: boolean): void => {
      props.setState({ ...props.state, toggles: { ...toggles, update } });
    }

    const updateGame = async (fields: IGameFormStateFields): Promise<void> => {    
      const update: IGameUpdate = GameFormUtility.mapUpdate(fields);
      
      await GameService.update(game.id, update);
  
      props.setState({ ...props.state, game: { ...game, ...update } });
    }

    return (
      <div className="game-page-content">
        <GameDetails game={game} />
        <div className="game-page-body">
          <h1 className="game-name passion-one-font">{game.name}</h1>
          <GameActions 
            creator={game.creator}
            invite={invite}
            toggle={() => toggle(true)}
          />
        </div>
        <UpdateGameModal state={props.state} cancel={() => toggle(false)} update={updateGame} />
      </div>
    )
  }

  return null;
}