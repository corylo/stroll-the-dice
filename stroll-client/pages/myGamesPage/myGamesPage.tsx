import React, { useContext } from "react";

import { Games } from "../../components/games/games";
import { Page } from "../../components/page/page";

import { AppContext } from "../../components/app/contexts/appContext";

import { useFetchGamesEffect } from "../../effects/gameEffects";

import { ImageUtility } from "../../utilities/imageUtility";

import { Graphic } from "../../../stroll-enums/graphic";

interface MyGamesPageProps {
  
}

export const MyGamesPage: React.FC<MyGamesPageProps> = (props: MyGamesPageProps) => {
  const { appState } = useContext(AppContext);

  const { games, status } = useFetchGamesEffect(appState);

  return(
    <Page 
      id="my-games-page" 
      backgroundGraphic={ImageUtility.getGraphic(Graphic.DayAtPark)} 
      status={status}
    >           
      <Games games={games} title="My Games" />
    </Page>
  )
}