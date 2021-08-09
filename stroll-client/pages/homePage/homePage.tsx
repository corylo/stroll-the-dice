import React, { useContext } from "react";

import { Button } from "../../components/buttons/button";
import { GameGroup } from "../../components/gameGroup/gameGroup";
import { HowToPlaySummary } from "../../components/howToPlaySummary/howToPlaySummary";
import { Page } from "../../components/page/page";

import { AppContext } from "../../components/app/contexts/appContext";

import { ImageUtility } from "../../utilities/imageUtility";

import { AppAction } from "../../enums/appAction";
import { AppStatus } from "../../enums/appStatus";
import { GameStatus } from "../../../stroll-enums/gameStatus";

interface HomePageProps {
  
}

export const HomePage: React.FC<HomePageProps> = (props: HomePageProps) => {
  const { appState, dispatchToApp } = useContext(AppContext);

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

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
          <HowToPlaySummary />
          <Button className="sign-in-link" handleOnClick={() => dispatch(AppAction.ToggleSignIn, true)}>
            <i className="fad fa-sign-in" />
            <h1 className="passion-one-font">Sign in to get started</h1>
          </Button>
          <h1 className="link-divider passion-one-font">Or</h1>
          <Button className="how-to-play-link" url="/how-to-play#goal">
            <i className="far fa-question" />
            <h1 className="passion-one-font">Learn more</h1>
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