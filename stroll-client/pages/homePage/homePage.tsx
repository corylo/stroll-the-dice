import React, { useContext } from "react";

import { Page } from "../../components/page/page";

import { AppContext } from "../../components/app/contexts/appContext";

import { AppStatus } from "../../enums/appStatus";

interface HomePageProps {
  
}

export const HomePage: React.FC<HomePageProps> = (props: HomePageProps) => {
  const { appState } = useContext(AppContext);

  const getBackgroundGraphic = (): string => {
    if(appState.status === AppStatus.SignedOut) {
      return "/img/graphics/sign-in.svg";
    }
  }

  return(
    <Page id="home-page">     
    
    </Page>
  )
}