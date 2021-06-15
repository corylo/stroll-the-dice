import React, { useState } from "react";
import { useRouteMatch } from "react-router";

import { GamePageContent } from "./components/gamePageContent/gamePageContent";
import { Page } from "../../components/page/page";

import { useFetchGameEffect } from "./effects/gamePageEffects";

import { ImageUtility } from "../../utilities/imageUtility";
import { UrlUtility } from "../../utilities/urlUtility";

import { defaultGamePageState, IGamePageState } from "./models/gamePageState";

import { Graphic } from "../../../stroll-enums/graphic";

interface GamePageProps {
  
}

export const GamePage: React.FC<GamePageProps> = (props: GamePageProps) => {
  const [state, setState] = useState<IGamePageState>(defaultGamePageState());

  useFetchGameEffect(UrlUtility.getParam(useRouteMatch(), "id"), state, setState);

  return(
    <Page 
      id="game-page" 
      backgroundGraphic={ImageUtility.getGraphic(Graphic.DayAtPark)} 
      status={state.status}
    >   
      <GamePageContent state={state} setState={setState} />
    </Page>
  )
}