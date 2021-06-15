import React from "react";

import { Button } from "../buttons/button";
import { Dot } from "../dot/dot";
import { Label } from "../label/label";
import { TooltipSide } from "../tooltip/tooltip";
import { UserLink } from "../userLink/userLink";

import { GameDurationUtility } from "../../utilities/gameDurationUtility";
import { GameModeUtility } from "../../utilities/gameModeUtility";

import { IGame } from "../../../stroll-models/game";

interface GameLinkProps {  
  game: IGame;
}

export const GameLink: React.FC<GameLinkProps> = (props: GameLinkProps) => {  
  const { game } = props;

  return ( 
    <div className="game-link-wrapper">
      <div className="game-link-header">
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
      <Button key={game.id} className="game-link" url={`/game/${game.id}`} />
      <div className="game-link-body">
        <h1 className="game-name passion-one-font">{game.name}</h1>
      </div>
    </div>
  ); 
}