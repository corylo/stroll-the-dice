import React, { useContext } from "react";

import { Games } from "../../components/games/games";
import { GamesGroup } from "../../components/games/gamesGroup";
import { Page } from "../../components/page/page";
import { PageMessage } from "../../components/page/pageMessage";

import { AppContext } from "../../components/app/contexts/appContext";

import { GameService } from "../../services/gameService";

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
          <GamesGroup title="In Progress">
            <Games 
              emptyMessage="You haven't joined any games in progress."
              gameStatus={GameStatus.InProgress}
              limit={2} 
              title="Joined" 
              get={GameService.getPlayingIn} 
            />
            <Games  
              emptyMessage="You aren't hosting any games in progress."
              gameStatus={GameStatus.InProgress}
              limit={2} 
              title="Hosting"
              get={GameService.getHosting} 
            />
          </GamesGroup>
          <GamesGroup title="Upcoming">
            <Games  
              emptyMessage="You haven't joined any upcoming games yet."
              gameStatus={GameStatus.Upcoming}
              limit={2} 
              title="Joined"
              get={GameService.getPlayingIn} 
            />
            <Games  
              emptyMessage="You aren't hosting any upcoming games yet."
              gameStatus={GameStatus.Upcoming}
              limit={2} 
              title="Hosting"
              get={GameService.getHosting} 
            />
          </GamesGroup>
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