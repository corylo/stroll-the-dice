import React, { useState } from "react";
import { useRouteMatch } from "react-router";

import { Page } from "../../components/page/page";
import { PageTitle } from "../../components/page/pageTitle";

import { useFetchGameEffect } from "./effects/gamePageEffects";

import { ImageUtility } from "../../utilities/imageUtility";

import { defaultGamePageState, IGamePageState } from "./models/gamePageState";

import { Graphic } from "../../../stroll-enums/graphic";
import { RequestStatus } from "../../../stroll-enums/requestStatus";

interface GamePageProps {
  
}

export const GamePage: React.FC<GamePageProps> = (props: GamePageProps) => {
  const match: any = useRouteMatch();

  const [state, setState] = useState<IGamePageState>(defaultGamePageState());

  const { game, status } = state;
  
  const getId = (): string => {
    if(match && match.params && match.params.id) {
      return match.params.id;
    }

    return "";
  }

  useFetchGameEffect(getId(), state, setState);

  const getContent = (): JSX.Element => {
    if(status === RequestStatus.Success && game !== null) {
      return (
        <React.Fragment>
          <PageTitle text={game.name} />
        </React.Fragment>
      )
    }
  }
  
  return(
    <Page id="game-page" backgroundGraphic={ImageUtility.getGraphic(Graphic.FinishLine)} status={status}>   
      {getContent()}
    </Page>
  )
}