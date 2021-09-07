import React, { createContext, useContext, useState } from "react";

import { GameHistory } from "./components/gameHistory/gameHistory";
import { GameStats } from "./components/gameStats/gameStats";
import { Page } from "../../components/page/page";
import { SignInToDoThisMessage } from "../../components/signInToDoThisMessage/signInToDoThisMessage";

import { AppContext } from "../../components/app/contexts/appContext";

import { useFetchGameHistoryEffect, useFetchGameStatsEffect } from "./effects/statsPageEffects";

import { ImageUtility } from "../../utilities/imageUtility";

import { defaultStatsPageState, IStatsPageState } from "./models/statsPageState";

import { AppStatus } from "../../enums/appStatus";

interface IStatsPageContext {
  state: IStatsPageState;
  setState: (state: IStatsPageState) => void;
}

export const StatsPageContext = createContext<IStatsPageContext>(null);

interface StatsPageProps {
  
}

export const StatsPage: React.FC<StatsPageProps> = (props: StatsPageProps) => {
  const { appState } = useContext(AppContext);

  const { profile } = appState.user;

  const [state, setState] = useState<IStatsPageState>(defaultStatsPageState());

  useFetchGameStatsEffect(appState.status, state, profile.uid, setState);

  useFetchGameHistoryEffect(state, profile.uid, setState);

  const getContent = (): JSX.Element => {
    if(appState.status === AppStatus.SignedIn) {
      return (
        <React.Fragment>
          <GameStats />
          <GameHistory />
        </React.Fragment>
      )
    } else {
      return (
        <SignInToDoThisMessage
          image={ImageUtility.getGraphic("park", "png")}
          text="Sign in to view your stats!"
        />
      )
    }
  }

  return(
    <StatsPageContext.Provider value={{ state, setState }}>
      <Page id="stats-page" backgroundGraphic="" status={state.statuses.initial}>  
        {getContent()}
      </Page>
    </StatsPageContext.Provider>
  )
}