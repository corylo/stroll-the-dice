import React, { useContext } from "react";

import { Button } from "../../components/buttons/button";
import { GameConglomerate } from "../../components/gameGroup/gameConglomerate";
import { HowToPlaySummary } from "../../components/howToPlaySummary/howToPlaySummary";
import { Page } from "../../components/page/page";
import { SignInLink } from "../../components/signInLink/signInLink";

import { AppContext } from "../../components/app/contexts/appContext";

import { ImageUtility } from "../../utilities/imageUtility";

import { AppStatus } from "../../enums/appStatus";

interface HomePageProps {
  
}

export const HomePage: React.FC<HomePageProps> = (props: HomePageProps) => {
  const { appState } = useContext(AppContext);

  const getContent = (): JSX.Element => {
    if(appState.status === AppStatus.SignedIn) {
      return (
        <GameConglomerate limit={10} />
      )
    } else {
      return (
        <div className="signed-out-content">
          <HowToPlaySummary />
          <SignInLink />
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
      showFooter
    >
      {getContent()}
    </Page>
  )
}