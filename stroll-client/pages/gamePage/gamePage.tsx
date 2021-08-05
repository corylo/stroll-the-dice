import React, { createContext, useContext, useState } from "react";
import { useRouteMatch } from "react-router";

import { GamePageContent } from "./components/gamePageContent/gamePageContent";
import { Page } from "../../components/page/page";

import { AppContext } from "../../components/app/contexts/appContext";

import { useUpdateCurrentDayEffect, useGameInviteEffect } from "./effects/gamePageEffects";
import { useGameListenersEffect } from "./effects/gamePageListenerEffects";

import { UrlUtility } from "../../utilities/urlUtility";

import { defaultGamePageState, IGamePageState } from "./models/gamePageState";

import { AppAction } from "../../enums/appAction";
import { AppStatus } from "../../enums/appStatus";
import { PlayerStatus } from "../../../stroll-enums/playerStatus";
import { RequestStatus } from "../../../stroll-enums/requestStatus";

interface IGamePageContext {
  state: IGamePageState;
  setState: (state: IGamePageState) => void;
}

export const GamePageContext = createContext<IGamePageContext>(null);

interface GamePageProps {
  
}

export const GamePage: React.FC<GamePageProps> = (props: GamePageProps) => {
  const { appState, dispatchToApp } = useContext(AppContext);

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const [state, setState] = useState<IGamePageState>(defaultGamePageState());    

  const id: string = UrlUtility.getParam(useRouteMatch(), "id");

  useGameInviteEffect(appState, state, dispatch, setState);

  useGameListenersEffect(id, appState, state, setState);

  useUpdateCurrentDayEffect(state, setState);

  console.log(state.statuses)

  const getStatus = (): RequestStatus => {
    if(
      appState.status === AppStatus.SignedIn && 
      state.statuses.game !== RequestStatus.Error &&
      state.statuses.player === PlayerStatus.Loading
    ) {
      return RequestStatus.Loading;
    }

    return state.statuses.game;
  }

  return(
    <GamePageContext.Provider value={{ state, setState }}>
      <Page 
        id="game-page" 
        backgroundGraphic=""
        status={getStatus()}
        errorMessage="Whoops! Looks like this game doesn't exist."
      >   
        <GamePageContent />
      </Page>
    </GamePageContext.Provider>
  )
}