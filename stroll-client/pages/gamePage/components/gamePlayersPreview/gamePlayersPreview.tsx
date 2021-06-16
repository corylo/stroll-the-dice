import React from "react";

import { Dot } from "../../../../components/dot/dot";
import { Label } from "../../../../components/label/label";
import { UserLink } from "../../../../components/userLink/userLink";

import { IGame } from "../../../../../stroll-models/game";
import { IGameSummary } from "../../../../../stroll-models/gameSummary";
import { IPlayer } from "../../../../../stroll-models/player";
import { GameModeUtility } from "../../../../utilities/gameModeUtility";

interface GamePlayersPreviewProps {  
  game: IGame;
  summary: IGameSummary;
}

export const GamePlayersPreview: React.FC<GamePlayersPreviewProps> = (props: GamePlayersPreviewProps) => {  
  if(props.summary) {
    const { game, summary } = props;

    const getPlayers = (): JSX.Element[] => {
      return summary.players.map((player: IPlayer) => {
        return (
          <UserLink key={player.id} profile={player.profile} />
        )
      });
    }

    const getTooltip = (): string => {
      if(summary.players.length === 1) {
        return `${summary.players.length} player`;
      }

      return `${summary.players.length} players`;
    }

    return (
      <div className="game-players-preview">        
        <div className="game-players-preview-label">
          <i className={GameModeUtility.getIcon(game.mode)} />
          <Dot />
          <Label className="passion-one-font" text={summary.players.length.toString()} tooltip={getTooltip()} />
        </div>
        <div className="game-players">
          {getPlayers()}
        </div>
      </div>
    );
  }

  return null;
}