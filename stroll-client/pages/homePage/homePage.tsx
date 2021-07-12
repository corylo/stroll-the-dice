import React, { useContext } from "react";

import { GameGroup } from "../../components/gameGroup/gameGroup";
import { Page } from "../../components/page/page";
import { PageMessage } from "../../components/page/pageMessage";

import { AppContext } from "../../components/app/contexts/appContext";

import { ImageUtility } from "../../utilities/imageUtility";

import { AppStatus } from "../../enums/appStatus";
import { GameStatus } from "../../../stroll-enums/gameStatus";
import { Graphic } from "../../../stroll-enums/graphic";

interface HomePageProps {
  
}

export const HomePage: React.FC<HomePageProps> = (props: HomePageProps) => {
  const { appState } = useContext(AppContext);

  const getContent = (): JSX.Element => {
    if(appState.status === AppStatus.SignedIn) {
      return (
        <React.Fragment>
          <GameGroup limit={2} status={GameStatus.InProgress} />
          <GameGroup limit={2} status={GameStatus.Upcoming} />
        </React.Fragment>
      )
    } else {
      return (
        <PageMessage className="sign-in-message">
          <h1 className="passion-one-font">Sign in to <span className="highlight-secondary">get strolling</span></h1>
        </PageMessage>
      )
    }
  }

  return(
    <Page 
      id="home-page" 
      backgroundGraphic={ImageUtility.getGraphic(Graphic.WorkingOut)}
    >
      {getContent()}
    </Page>
  )
}