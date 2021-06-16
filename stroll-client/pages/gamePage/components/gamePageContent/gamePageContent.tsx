import React from "react";

import { GameDetails } from "../../../../components/gameDetails/gameDetails";
import { UpdateGameButton } from "../updateGameButton/updateGameButton";
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
  const { game, status, toggles } = props.state;
  
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
      <React.Fragment>
        <GameDetails game={game} />
        <div className="game-page-body">
          <div className="game-name-wrapper">
            <h1 className="game-name passion-one-font">{game.name}</h1>          
            <UpdateGameButton creator={game.creator} toggle={() => toggle(true)} />
          </div>
        </div>
        <UpdateGameModal state={props.state} cancel={() => toggle(false)} update={updateGame} />
      </React.Fragment>
    )
  }

  return null;
}