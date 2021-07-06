import React from "react";

import { Label } from "../label/label";

import { GameDurationUtility } from "../../../stroll-utilities/gameDurationUtility";

import { useCurrentDateEffect } from "../../effects/appEffects";

import { IGame } from "../../../stroll-models/game";

import { GameStatus } from "../../../stroll-enums/gameStatus";

interface GameDayStatusProps { 
  day: number;
  game: IGame;
  dayStatus: GameStatus;
}

export const GameDayStatus: React.FC<GameDayStatusProps> = (props: GameDayStatusProps) => {    
  const { game, dayStatus } = props;

  useCurrentDateEffect();
  
  const getText = (): string => {
    const timeRemaining: string = GameDurationUtility.getTimeRemainingInToday(game, props.day);

    if(dayStatus === GameStatus.Completed) {
      return "Completed";
    } else if(dayStatus === GameStatus.InProgress) {
      return `Ends in ${timeRemaining}`;      
    } else if(dayStatus === GameStatus.Upcoming) {
      return `Starts in ${timeRemaining}`;      
    }
  }

  return (
    <Label
      className="game-day-status date-status passion-one-font"
      icon="fal fa-clock"
      text={getText()}
    />
  );
}