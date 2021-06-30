import React from "react";

import { Games } from "../../components/games/games";
import { GamesGroup } from "../../components/games/gamesGroup";
import { Page } from "../../components/page/page";

import { GameService } from "../../services/gameService";

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
      <React.Fragment>
        <GamesGroup title="In Progress">
          <Games 
            emptyMessage="You haven't joined any games in progress."
            gameStatus={GameStatus.InProgress}
            limit={10} 
            title="Joined" 
            get={GameService.getPlayingIn} 
          />
          <Games  
            emptyMessage="You aren't hosting any games in progress."
            gameStatus={GameStatus.InProgress}
            limit={10} 
            title="Hosting"
            get={GameService.getHosting} 
          />
        </GamesGroup>
        <GamesGroup title="Upcoming">
          <Games  
            emptyMessage="You haven't joined any upcoming games yet."
            gameStatus={GameStatus.Upcoming}
            limit={10} 
            title="Joined"
            get={GameService.getPlayingIn} 
          />
          <Games  
            emptyMessage="You aren't hosting any upcoming games yet."
            gameStatus={GameStatus.Upcoming}
            limit={10} 
            title="Hosting"
            get={GameService.getHosting} 
          />
        </GamesGroup>
        <GamesGroup title="Completed">
          <Games  
            emptyMessage="You haven't completed any joined games yet."
            gameStatus={GameStatus.Completed}
            limit={10} 
            title="Joined"
            get={GameService.getPlayingIn} 
          />
          <Games  
            emptyMessage="You haven't completed any games you've created yet."
            gameStatus={GameStatus.Completed}
            limit={10} 
            title="Hosting"
            get={GameService.getHosting} 
          />
        </GamesGroup>
      </React.Fragment>
    </Page>
  )
}