import React, { createContext, useContext, useState } from "react";

import { GameDayStatement } from "../../components/gameDayStatement/gameDayStatement";
import { MyGameDayHistory } from "./components/myGameDayHistory";
import { Page } from "../../components/page/page";
import { SignInToDoThisMessage } from "../../components/signInToDoThisMessage/signInToDoThisMessage";

import { AppContext } from "../../components/app/contexts/appContext";

import { useFetchGameDayHistoryEffect } from "./effects/myGameDaysPageEffects";

import { ImageUtility } from "../../utilities/imageUtility";
import { MetaUtility } from "../../utilities/metaUtility";

import { defaultMyGameDaysPageState, IMyGameDaysPageState } from "./models/myGameDaysPageState";

import { AppStatus } from "../../enums/appStatus";


interface IMyGameDaysPageContext {
  state: IMyGameDaysPageState;
  setState: (state: IMyGameDaysPageState) => void;
}

export const MyGameDaysPageContext = createContext<IMyGameDaysPageContext>(null);

interface MyGameDaysPageProps {
  
}

export const MyGameDaysPage: React.FC<MyGameDaysPageProps> = (props: MyGameDaysPageProps) => {
  const { appState } = useContext(AppContext);

  const { user } = appState;

  const [state, setState] = useState<IMyGameDaysPageState>(defaultMyGameDaysPageState());

  useFetchGameDayHistoryEffect(state, user.profile.uid, setState);

  const getContent = (): JSX.Element => {
    if(appState.status === AppStatus.SignedIn) {
      return (
        <React.Fragment>          
          <h1 className="game-days passion-one-font"><GameDayStatement quantity={user.stats.gameDays.available} /></h1>
          <MyGameDayHistory />
        </React.Fragment>
      )
    } else {
      return (
        <SignInToDoThisMessage
          image={ImageUtility.getGraphic("park", "png")}
          text="Sign in to view your Game Day history!"
        />
      )
    }
  }

  return(
    <MyGameDaysPageContext.Provider value={{ state, setState }}>
      <Page id="my-game-days-page" backgroundGraphic="" meta={MetaUtility.getMyGameDaysPageMeta()}>     
        {getContent()}
      </Page>
    </MyGameDaysPageContext.Provider>
  )
}
