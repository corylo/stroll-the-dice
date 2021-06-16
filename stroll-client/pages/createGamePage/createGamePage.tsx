import React, { useContext } from "react";
import { useHistory } from "react-router";

import { GameForm } from "../../components/gameForm/gameForm";
import { Page } from "../../components/page/page";

import { AppContext } from "../../components/app/contexts/appContext";

import { GameService } from "../../services/gameService";

import { GameFormUtility } from "../../components/gameForm/utilities/gameFormUtility";
import { ImageUtility } from "../../utilities/imageUtility";

import { IGame } from "../../../stroll-models/game";
import { IGameFormStateFields } from "../../components/gameForm/models/gameFormStateFields";

interface CreateGamePageProps {
  
}

export const CreateGamePage: React.FC<CreateGamePageProps> = (props: CreateGamePageProps) => {
  const { appState } = useContext(AppContext);

  const history: any = useHistory();

  const save = async (fields: IGameFormStateFields): Promise<void> => {    
    const game: IGame = GameFormUtility.mapCreate(fields, appState.user);

    await GameService.create(game);

    history.push(`/game/${game.id}`);
  }

  return(
    <Page id="create-game-page" backgroundGraphic={ImageUtility.getGraphic("hiking")}>    
      <GameForm title="Create Game" save={save} />
    </Page>
  )
}