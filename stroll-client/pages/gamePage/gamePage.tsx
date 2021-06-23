import React, { createContext, useContext, useState } from "react";
import { useRouteMatch } from "react-router";

import { GamePageContent } from "./components/gamePageContent/gamePageContent";
import { Page } from "../../components/page/page";

import { AppContext } from "../../components/app/contexts/appContext";

import { useFetchGameEffect, useGameInviteEffect, useUpdateCurrentPlayerEffect } from "./effects/gamePageEffects";
import { useGameListenersEffect } from "./effects/gamePageListenerEffects";

import { ImageUtility } from "../../utilities/imageUtility";
import { UrlUtility } from "../../utilities/urlUtility";

import { defaultGamePageState, IGamePageState } from "./models/gamePageState";

import { AppAction } from "../../enums/appAction";
import { Graphic } from "../../../stroll-enums/graphic";

interface IGamePageContext {
  state: IGamePageState;
  setState: (state: IGamePageState) => void;
}

export const GamePageContext = createContext<IGamePageContext>(null);

interface GamePageProps {
  
}

export const GamePage: React.FC<GamePageProps> = (props: GamePageProps) => {
  const { appState, dispatchToApp } = useContext(AppContext);

  const { user } = appState;
  
  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const [state, setState] = useState<IGamePageState>(defaultGamePageState());    

  const id: string = UrlUtility.getParam(useRouteMatch(), "id");

  useUpdateCurrentPlayerEffect(user, state, setState);

  useFetchGameEffect(id, appState, state, setState);

  useGameInviteEffect(appState, state, dispatch, setState);

  useGameListenersEffect(state, setState);
  
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