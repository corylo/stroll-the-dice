import React, { useContext } from "react";

import { Games } from "../../components/games/games";
import { Page } from "../../components/page/page";

import { AppContext } from "../../components/app/contexts/appContext";

import { useFetchGamesEffect } from "../../effects/gameEffects";

import { ImageUtility } from "../../utilities/imageUtility";

import { Graphic } from "../../../stroll-enums/graphic";

interface HomePageProps {
  
}

export const HomePage: React.FC<HomePageProps> = (props: HomePageProps) => {
  const { appState } = useContext(AppContext);

  const { games, status } = useFetchGamesEffect(appState, 3);

  return(
    <Page 
      id="home-page" 
      backgroundGraphic={ImageUtility.getGraphic(Graphic.WorkingOut)}
      status={status}
    >
      <Games games={games} title="Recent Games" />
    </Page>
  )
}