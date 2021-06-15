import React, { useContext } from "react";

import { Page } from "../../components/page/page";

import { AppContext } from "../../components/app/contexts/appContext";

import { ImageUtility } from "../../utilities/imageUtility";

import { Graphic } from "../../../stroll-enums/graphic";

interface GamePageProps {
  
}

export const GamePage: React.FC<GamePageProps> = (props: GamePageProps) => {
  const { appState } = useContext(AppContext);

  return(
    <Page id="game-page" backgroundGraphic={ImageUtility.getGraphic(Graphic.FinishLine)}>     
    
    </Page>
  )
}