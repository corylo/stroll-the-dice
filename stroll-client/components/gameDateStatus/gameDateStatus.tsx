import React from "react";

import { Label } from "../label/label";
import { TooltipSide } from "../tooltip/tooltip";

import { DateUtility } from "../../../stroll-utilities/dateUtility";
import { FirestoreDateUtility } from "../../../stroll-utilities/firestoreDateUtility";
import { GameDurationUtility } from "../../../stroll-utilities/gameDurationUtility";

import { IGame } from "../../../stroll-models/game";

import { GameStatus } from "../../../stroll-enums/gameStatus";

interface GameDateStatusProps {  
  game: IGame;
  gameStatus: GameStatus;
}

export const GameDateStatus: React.FC<GameDateStatusProps> = (props: GameDateStatusProps) => {    
  const { game, gameStatus } = props;

  const getText = (): string => {
    if(gameStatus === GameStatus.Completed) {
      return "Completed";
    } else if(gameStatus === GameStatus.InProgress) {
      return `Ends in ${GameDurationUtility.getTimeRemaining(game)}`;
    } else if (gameStatus === GameStatus.Upcoming) {
      return `Starts in ${FirestoreDateUtility.timestampToRelative(game.startsAt)}`;
    }
  }

  const getTooltip = (): string => {
    if(FirestoreDateUtility.lessThanOrEqualToNow(game.startsAt)) {
      const locale: string = DateUtility.secondsToLocale(GameDurationUtility.getEndsAt(game));

      return locale;
    }

    return FirestoreDateUtility.timestampToLocale(game.startsAt);
  }
  
  return (
    <Label
      className="game-date-status passion-one-font"
      icon="fal fa-clock"
      text={getText()}
      tooltip={getTooltip()}
      tooltipSide={TooltipSide.Bottom}
    />
  );
}