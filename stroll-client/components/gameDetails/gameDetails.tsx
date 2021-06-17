import React from "react";

import { Label } from "../label/label";

import { GameDurationUtility } from "../../utilities/gameDurationUtility";
import { GameModeUtility } from "../../utilities/gameModeUtility";

import { IGame } from "../../../stroll-models/game";
import { IGameSummary } from "../../../stroll-models/gameSummary";

interface GameDetailsProps {  
  game: IGame;
  summary?: IGameSummary;
}

export const GameDetails: React.FC<GameDetailsProps> = (props: GameDetailsProps) => {  
  const { game, summary } = props;

  const getPlayerCount = (): JSX.Element => {
    if(summary) {
      const getText = (): string => {
        if(summary.players.length === 1) {
          return `${summary.players.length} player`;
        }
  
        return `${summary.players.length} players`;
      }

      return (
        <Label 
          className="game-player-count passion-one-font" 
          text={getText()} 
        />
      )
    }
  }

  return ( 
    <div className="game-details">
      <Label 
        className="game-duration passion-one-font" 
        text={GameDurationUtility.getLabel(game.duration)} 
        tooltip="Duration"
      />
      <Label 
        className="game-mode passion-one-" 
        icon={GameModeUtility.getIcon(game.mode)}
        text={game.mode}
        tooltip="Mode"
      />
      {getPlayerCount()}
    </div>
  ); 
}