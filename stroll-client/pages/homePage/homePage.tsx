import React, { useContext } from "react";

import { Page } from "../../components/page/page";

import { AppContext } from "../../components/app/contexts/appContext";

import { ImageUtility } from "../../utilities/imageUtility";

import { AppStatus } from "../../enums/appStatus";
import { Graphic } from "../../../stroll-enums/graphic";

interface HomePageProps {
  
}

export const HomePage: React.FC<HomePageProps> = (props: HomePageProps) => {
  const { appState } = useContext(AppContext);

  return(
    <Page id="home-page" backgroundGraphic={ImageUtility.getGraphic(Graphic.RunningPair)}>     
    
    </Page>
  )
}