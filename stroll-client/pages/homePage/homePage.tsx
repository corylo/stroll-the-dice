import React, { useContext } from "react";

import { ConnectAStepTrackerMessage } from "../../components/connectAStepTrackerMessage/connectAStepTrackerMessage";
import { GameConglomerate } from "../../components/gameGroup/gameConglomerate";
import { GameInviteInput } from "../../components/gameInviteInput/gameInviteInput";
import { HowToPlaySummary } from "../../components/howToPlaySummary/howToPlaySummary";
import { LearnMoreLink } from "../../components/learnMoreLink/learnMoreLink";
import { Page } from "../../components/page/page";
import { SignInLink } from "../../components/signInLink/signInLink";

import { AppContext } from "../../components/app/contexts/appContext";

import { AppStatus } from "../../enums/appStatus";

interface HomePageProps {
  
}

export const HomePage: React.FC<HomePageProps> = (props: HomePageProps) => {
  const { appState } = useContext(AppContext);

  const getContent = (): JSX.Element => {
    if(appState.status === AppStatus.SignedIn) {
      return (
        <React.Fragment>
          <LearnMoreLink text="How To Play" />
          <ConnectAStepTrackerMessage />
          <GameInviteInput />
          <GameConglomerate limit={5} />
        </React.Fragment>
      )
    } else {
      return (
        <div className="signed-out-content">
          <HowToPlaySummary />
          <SignInLink />
          <div className="link-divider">
            <h1 className=" passion-one-font">Or</h1>
          </div>
          <LearnMoreLink />
        </div>
      )
    }
  }

  return(
    <Page 
      id="home-page" 
      backgroundGraphic=""
      showFooter
    >
      {getContent()}
    </Page>
  )
}