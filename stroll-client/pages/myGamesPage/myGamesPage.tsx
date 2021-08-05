import React from "react";

import { GameGroup } from "../../components/gameGroup/gameGroup";
import { Page } from "../../components/page/page";

import { GameStatus } from "../../../stroll-enums/gameStatus";

interface MyGamesPageProps {
  
}

export const MyGamesPage: React.FC<MyGamesPageProps> = (props: MyGamesPageProps) => {
  return(
    <Page 
      id="my-games-page" 
      backgroundGraphic=""
      requireAuth
    >    
      <GameGroup limit={10} status={GameStatus.InProgress} />
      <GameGroup limit={10} status={GameStatus.Upcoming} />
      <GameGroup limit={10} status={GameStatus.Completed} />
    </Page>
  )
}