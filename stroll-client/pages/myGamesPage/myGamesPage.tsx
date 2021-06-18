import React from "react";

import { Games } from "../../components/games/games";
import { Page } from "../../components/page/page";

import { GameService } from "../../services/gameService";

import { ImageUtility } from "../../utilities/imageUtility";

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
      <Games 
        emptyMessage="You're not playing in any games yet."
        limit={10} 
        title="Playing In" 
        get={GameService.getAllPlayingIn} 
      />
      <Games  
        emptyMessage="You haven't created any games yet."
        limit={10} 
        title="My Games"
        get={GameService.getAllMyGames} 
      />
    </Page>
  )
}