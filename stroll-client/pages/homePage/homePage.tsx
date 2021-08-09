import React, { useContext } from "react";

import { Button } from "../../components/buttons/button";
import { GameGroup } from "../../components/gameGroup/gameGroup";
import { HomePagePanel } from "./components/homePagePanel/homePagePanel";
import { Page } from "../../components/page/page";

import { AppContext } from "../../components/app/contexts/appContext";

import { ImageUtility } from "../../utilities/imageUtility";

import { AppStatus } from "../../enums/appStatus";
import { GameStatus } from "../../../stroll-enums/gameStatus";

interface HomePageProps {
  
}

export const HomePage: React.FC<HomePageProps> = (props: HomePageProps) => {
  const { appState } = useContext(AppContext);

  const getContent = (): JSX.Element => {
    if(appState.status === AppStatus.SignedIn) {
      return (
        <React.Fragment>
          <GameGroup limit={10} status={GameStatus.InProgress} />
          <GameGroup limit={10} status={GameStatus.Upcoming} />
          <GameGroup limit={10} status={GameStatus.Completed} />
        </React.Fragment>
      )
    } else {
      return (
        <div className="signed-out-content">
          <HomePagePanel
            image="/img/cyclist.png"            
            text="Stroll The Dice is the combination of a stepping competition and a prediction game rolled into one."
            title="Strolling or rolling, just get going"
          />
          <HomePagePanel
            image="/img/matchup.png"            
            right
            text="Games last between 1 and 7 days with different matchups each day. Earn points by taking steps and beating your competitor."
            title="Get matched up head to head against your friends"
          />
          <HomePagePanel
            image="/img/dice.png"                        
            text="Each player starts with 10,000 points to use for guessing matchup outcomes."
            title="Earn additional points by predicting matchup winners"
          />
          <HomePagePanel
            image="/img/winner.png"
            right
            title="Have the most points at the end of the game and you win!"
          />
          <Button className="how-to-play-link" url="/huh">
            <i className="far fa-question" />
            <h1 className="passion-one-font">How To Play</h1>
          </Button>
        </div>
      )
    }
  }

  return(
    <Page 
      id="home-page" 
      backgroundGraphic={ImageUtility.getGraphic("running", "png")}
    >
      {getContent()}
    </Page>
  )
}