import React, { useState } from "react";
import { useRouteMatch } from "react-router";

import { Dot } from "../../components/dot/dot";
import { Label } from "../../components/label/label";
import { Page } from "../../components/page/page";
import { TooltipSide } from "../../components/tooltip/tooltip";
import { UserLink } from "../../components/userLink/userLink";

import { useFetchGameEffect } from "./effects/gamePageEffects";

import { GameDurationUtility } from "../../utilities/gameDurationUtility";
import { GameModeUtility } from "../../utilities/gameModeUtility";
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
          <div className="game-page-header">
            <UserLink profile={game.creator} />
            <Dot />
            <Label 
              className="game-duration passion-one-font" 
              text={GameDurationUtility.getShortLabel(game.duration)} 
              tooltip={GameDurationUtility.getLabel(game.duration)}
              tooltipSide={TooltipSide.Bottom}
            />
            <Dot />
            <Label 
              className="game-mode" 
              icon={GameModeUtility.getIcon(game.mode)} 
              tooltip={game.mode}
              tooltipSide={TooltipSide.Bottom}
            />
          </div>          
          <div className="game-page-body">
            <h1 className="game-name passion-one-font">{game.name}</h1>
          </div>
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