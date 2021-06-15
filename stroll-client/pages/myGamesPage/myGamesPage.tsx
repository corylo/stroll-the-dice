import React, { useContext } from "react";

import { GameLink } from "../../components/gameLink/gameLink";
import { Page } from "../../components/page/page";
import { PageTitle } from "../../components/page/pageTitle";

import { AppContext } from "../../components/app/contexts/appContext";

import { useFetchGamesEffect } from "../../effects/gameEffects";

import { ImageUtility } from "../../utilities/imageUtility";

import { IGame } from "../../../stroll-models/game";

import { Graphic } from "../../../stroll-enums/graphic";

interface MyGamesPageProps {
  
}

export const MyGamesPage: React.FC<MyGamesPageProps> = (props: MyGamesPageProps) => {
  const { appState } = useContext(AppContext);

  const { games, status } = useFetchGamesEffect(appState);

  const getGames = (): JSX.Element => {
    if(games.length > 0) {
      const links: JSX.Element[] = games.map((game: IGame) =>         
        <GameLink key={game.id} game={game} />
      );

      return (
        <div className="my-games">
          {links}
        </div>
      )
    }

    return null;
  }
  
  return(
    <Page 
      id="my-games-page" 
      backgroundGraphic={ImageUtility.getGraphic(Graphic.DayAtPark)} 
      status={status}
    >     
      <PageTitle text="My Games" />
      {getGames()}
    </Page>
  )
}