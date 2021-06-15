import React from "react";

import { Dot } from "../dot/dot";
import { Label } from "../label/label";
import { TooltipSide } from "../tooltip/tooltip";
import { UserLink } from "../userLink/userLink";

import { GameDurationUtility } from "../../utilities/gameDurationUtility";
import { GameModeUtility } from "../../utilities/gameModeUtility";

import { IGame } from "../../../stroll-models/game";

interface GameDetailsProps {  
  game: IGame;
}

export const GameDetails: React.FC<GameDetailsProps> = (props: GameDetailsProps) => {  
  const { game } = props;

  return ( 
    <div className="game-details">
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
  ); 
}