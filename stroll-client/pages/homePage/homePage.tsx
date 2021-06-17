import React, { useContext } from "react";

import { Games } from "../../components/games/games";
import { Page } from "../../components/page/page";
import { PageMessage } from "../../components/page/pageMessage";

import { AppContext } from "../../components/app/contexts/appContext";

import { GameService } from "../../services/gameService";

import { ImageUtility } from "../../utilities/imageUtility";

import { AppStatus } from "../../enums/appStatus";
import { Graphic } from "../../../stroll-enums/graphic";

interface HomePageProps {
  
}

export const HomePage: React.FC<HomePageProps> = (props: HomePageProps) => {
  const { appState } = useContext(AppContext);

  const getContent = (): JSX.Element => {
    if(appState.status === AppStatus.SignedIn) {
      return (
        <React.Fragment>
          <Games  
            emptyMessage="You haven't created any games yet."
            limit={3} 
            title="My Games"
            get={GameService.getAllMyGames} 
          />
          <Games 
            emptyMessage="You're not playing in any games yet."
            limit={3} 
            title="Playing In" 
            get={GameService.getAllPlayingIn} 
          />
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

  const getGraphic = (): string => {
    if(appState.status === AppStatus.SignedIn) {
      return ImageUtility.getGraphic(Graphic.WorkingOut);
    } else if(appState.status === AppStatus.SignedOut) {
      return ImageUtility.getGraphic(Graphic.AccessAccount);
    }

    return "";
  }

  return(
    <Page 
      id="home-page" 
      backgroundGraphic={getGraphic()}
    >
      {getContent()}
    </Page>
  )
}