import React, { useContext } from "react";

import { GameForm } from "../../components/gameForm/gameForm";
import { Page } from "../../components/page/page";

import { AppContext } from "../../components/app/contexts/appContext";

import { GameFormUtility } from "../../components/gameForm/utilities/gameFormUtility";

import { IGame } from "../../../stroll-models/game";
import { IGameFormStateFields } from "../../components/gameForm/models/gameFormStateFields";

interface CreateGamePageProps {
  
}

export const CreateGamePage: React.FC<CreateGamePageProps> = (props: CreateGamePageProps) => {
  const { appState } = useContext(AppContext);

  const save = async (fields: IGameFormStateFields): Promise<void> => {    
    const game: IGame = GameFormUtility.mapCreate(fields, appState.user);

    console.log(game)
        
    // await GameService.create(game);

    // history.push(`/game/${game.id}`);
  }

  return(
    <Page id="create-game-page">    
      <GameForm save={save} />
    </Page>
  )
}