import React from "react";

import { Label } from "../label/label";
import { TooltipSide } from "../tooltip/tooltip";

import { FirestoreDateUtility } from "../../../stroll-utilities/firestoreDateUtility";
import { GameDurationUtility } from "../../../stroll-utilities/gameDurationUtility";

import { IGame } from "../../../stroll-models/game";

import { GameStatus } from "../../../stroll-enums/gameStatus";

interface GameDateStatusProps {  
  game: IGame;
}

export const GameDateStatus: React.FC<GameDateStatusProps> = (props: GameDateStatusProps) => {    
  const { game } = props;

  const getText = (): string => {
    if(game.status === GameStatus.Completed) {
      return "Completed";
    } else if(game.status === GameStatus.InProgress) {
      return `Ends in ${GameDurationUtility.getTimeRemaining(game)}`;
    } else if (game.status === GameStatus.Upcoming) {
      return `Starts in ${FirestoreDateUtility.timestampToRelative(game.startsAt)}`;
    }
  }

  const getTooltip = (): string => {
    if(FirestoreDateUtility.lessThanOrEqualToNow(game.startsAt)) {
      return FirestoreDateUtility.timestampToLocale(game.endsAt);
    }

    return FirestoreDateUtility.timestampToLocale(game.startsAt);
  }
  
  return (
    <Label
      className="game-date-status date-status passion-one-font"
      icon="fal fa-clock"
      text={getText()}
      tooltip={getTooltip()}
      tooltipSide={TooltipSide.Bottom}
    />
  );
}