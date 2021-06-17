import React from "react";

import { Games } from "../../components/games/games";
import { Page } from "../../components/page/page";

import { GameService } from "../../services/gameService";

import { ImageUtility } from "../../utilities/imageUtility";

import { Graphic } from "../../../stroll-enums/graphic";

interface HomePageProps {
  
}

export const HomePage: React.FC<HomePageProps> = (props: HomePageProps) => {
  return(
    <Page 
      id="home-page" 
      backgroundGraphic={ImageUtility.getGraphic(Graphic.WorkingOut)}
    >
      <Games  
        limit={3} 
        title="My Games"
        get={GameService.getAll} 
      />
      <Games 
        limit={3} 
        title="Playing In" 
        get={GameService.getAllPlaying} 
      />
    </Page>
  )
}