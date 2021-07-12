import React from "react";

import { GameGroup } from "../../components/gameGroup/gameGroup";
import { Page } from "../../components/page/page";

import { ImageUtility } from "../../utilities/imageUtility";

import { GameStatus } from "../../../stroll-enums/gameStatus";
import { Graphic } from "../../../stroll-enums/graphic";

interface MyGamesPageProps {
  
}

export const MyGamesPage: React.FC<MyGamesPageProps> = (props: MyGamesPageProps) => {
  return(
    <Page 
      id="my-games-page" 
      backgroundGraphic={ImageUtility.getGraphic(Graphic.DayAtPark)} 
      requireAuth
    >    
      <GameGroup limit={10} status={GameStatus.InProgress} />
      <GameGroup limit={10} status={GameStatus.Upcoming} />
      <GameGroup limit={10} status={GameStatus.Completed} />
    </Page>
  )
}