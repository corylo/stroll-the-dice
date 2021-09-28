import React, { useContext, useMemo } from "react";

import { ConnectAStepTrackerMessage } from "../../components/connectAStepTrackerMessage/connectAStepTrackerMessage";
import { GameFeed } from "../../components/gameFeed/gameFeed";
import { GameInviteInput } from "../../components/gameInviteInput/gameInviteInput";
import { HowToPlaySummary } from "../../components/howToPlaySummary/howToPlaySummary";
import { LearnMoreLink } from "../../components/learnMoreLink/learnMoreLink";
import { Page } from "../../components/page/page";
import { SignInLink } from "../../components/signInLink/signInLink";

import { AppContext } from "../../components/app/contexts/appContext";

import { ImageUtility } from "../../utilities/imageUtility";
import { MetaUtility } from "../../utilities/metaUtility";

import { AppAction } from "../../enums/appAction";
import { AppStatus } from "../../enums/appStatus";
import { HowToPlayID } from "../../enums/howToPlayID";

interface HomePageProps {
  
}

export const HomePage: React.FC<HomePageProps> = (props: HomePageProps) => {
  const { appState, dispatchToApp } = useContext(AppContext);

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const getContent = (): JSX.Element => {
    const toggle = (howToPlayID: HowToPlayID): void => {
      dispatch(AppAction.ToggleHowToPlay, { howToPlay: true, howToPlayID });
    }

    if(appState.status === AppStatus.SignedIn) {
      return (
        <React.Fragment>
          <div className="learn-more-links">
            <LearnMoreLink 
              image={ImageUtility.getGraphic("learn-more", "png")}
              text="Getting Started" 
              handleOnClick={() => toggle(HowToPlayID.GettingStarted)}
            />
          </div>
          <ConnectAStepTrackerMessage />
          <GameInviteInput />
          <GameFeed limit={5} />
        </React.Fragment>
      )
    } else {
      const memoizedHowToPlaySummary = useMemo(() => <HowToPlaySummary />, []);
      
      return (
        <div className="signed-out-content">
          {memoizedHowToPlaySummary}
          <SignInLink />
          <div className="link-divider">
            <h1 className=" passion-one-font">Or</h1>
          </div>
          <LearnMoreLink 
            image={ImageUtility.getGraphic("learn-more", "png")}
            text="Learn more" 
            handleOnClick={() => toggle(HowToPlayID.Unknown)}
          />
        </div>
      )
    }
  }

  return(
    <Page 
      id="home-page" 
      backgroundGraphic=""
      meta={MetaUtility.getHomePageMeta()}
      showFooter
    >
      {getContent()}
    </Page>
  )
}