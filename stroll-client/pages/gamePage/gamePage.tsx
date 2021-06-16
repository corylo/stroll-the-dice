import React, { createContext, useContext, useState } from "react";
import { useRouteMatch } from "react-router";

import { GamePageContent } from "./components/gamePageContent/gamePageContent";
import { Page } from "../../components/page/page";

import { AppContext } from "../../components/app/contexts/appContext";

import { useClearParamsEffect } from "../../effects/appEffects";
import { useFetchGameEffect, useGameInviteEffect } from "./effects/gamePageEffects";

import { ImageUtility } from "../../utilities/imageUtility";
import { UrlUtility } from "../../utilities/urlUtility";

import { defaultGamePageState, IGamePageState } from "./models/gamePageState";

import { Graphic } from "../../../stroll-enums/graphic";

interface IGamePageContext {
  state: IGamePageState;
  setState: (state: IGamePageState) => void;
}

export const GamePageContext = createContext<IGamePageContext>(null);

interface GamePageProps {
  
}

export const GamePage: React.FC<GamePageProps> = (props: GamePageProps) => {
  const { appState } = useContext(AppContext);

  const { user } = appState;

  const [state, setState] = useState<IGamePageState>(defaultGamePageState());    

  const id: string = UrlUtility.getParam(useRouteMatch(), "id");

  useFetchGameEffect(id, state, setState);

  useGameInviteEffect(user, state, setState);

  useClearParamsEffect("invite");

  return(
    <GamePageContext.Provider value={{ state, setState }}>
      <Page 
        id="game-page" 
        backgroundGraphic={ImageUtility.getGraphic(Graphic.DayAtPark)} 
        status={state.status}
      >   
        <GamePageContent />
      </Page>
    </GamePageContext.Provider>
  )
}