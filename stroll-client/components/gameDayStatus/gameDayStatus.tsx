import React from "react";

import { Label } from "../label/label";

import { GameDurationUtility } from "../../../stroll-utilities/gameDurationUtility";

import { useCurrentDateEffect } from "../../effects/appEffects";

import { IGame } from "../../../stroll-models/game";

import { GameStatus } from "../../../stroll-enums/gameStatus";

interface GameDayStatusProps { 
  day: number;
  game: IGame;
  status: GameStatus;
}

export const GameDayStatus: React.FC<GameDayStatusProps> = (props: GameDayStatusProps) => {    
  const { status } = props;

  useCurrentDateEffect();
  
  const getText = (): string => {
    const timeRemaining: string = GameDurationUtility.getTimeRemainingInToday(props.game, props.day);

    if(status === GameStatus.Completed) {
      return "Completed";
    } else if(status === GameStatus.InProgress) {
      return `Ends in ${timeRemaining}`;      
    } else if(status === GameStatus.Upcoming) {
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