import React from "react";

import { Label } from "../label/label";
import { TooltipSide } from "../tooltip/tooltip";

import { GameDurationUtility } from "../../../stroll-utilities/gameDurationUtility";
import { GameModeUtility } from "../../utilities/gameModeUtility";

import { IGame } from "../../../stroll-models/game";

interface GameDetailsProps {  
  game: IGame;
  togglePlayers?: () => void;
}

export const GameDetails: React.FC<GameDetailsProps> = (props: GameDetailsProps) => {  
  const { game } = props;

  return ( 
    <div className="game-details">
      <div className="game-labels">
        <Label 
          className="game-duration passion-one-font" 
          text={GameDurationUtility.getLabel(game.duration)} 
          tooltip="Duration"
        />
        <Label 
          className="game-mode" 
          icon={GameModeUtility.getIcon(game.mode)}
          text={game.mode}
          tooltip="Mode"
        />
        <Label 
          className="game-player-count passion-one-font" 
          icon="fal fa-user-friends"
          text={`${game.counts.players.toString()} / 20`} 
          tooltip={props.togglePlayers ? "View" : null}
          tooltipSide={TooltipSide.Bottom}
          handleOnClick={props.togglePlayers}
        />
      </div>
    </div>
  ); 
}