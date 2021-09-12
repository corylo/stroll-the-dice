import React from "react";

import { Label } from "../label/label";

import { FirestoreDateUtility } from "../../../stroll-utilities/firestoreDateUtility";
import { GameDurationUtility } from "../../../stroll-utilities/gameDurationUtility";

import { useCurrentDateEffect } from "../../effects/appEffects";

import { IGame } from "../../../stroll-models/game";

import { GameStatus } from "../../../stroll-enums/gameStatus";

interface GameDayStatusProps { 
  currentDay: number;
  day: number;
  game: IGame;
}

export const GameDayStatus: React.FC<GameDayStatusProps> = (props: GameDayStatusProps) => {    
  const { game } = props;

  useCurrentDateEffect();
  
  const dayStatus: GameStatus = GameDurationUtility.getDayStatus(props.day, props.currentDay);

  const getText = (): string => {
    const timeRemaining: string = GameDurationUtility.getTimeRemainingInToday(game, props.currentDay),
      endOfDayUpdateComplete: boolean = FirestoreDateUtility.endOfDayProgressUpdateComplete(props.day, game.startsAt, game.progressUpdateAt);
        
    const upcoming: boolean = dayStatus === GameStatus.Upcoming,
      inProgress: boolean = dayStatus === GameStatus.InProgress,
      completed: boolean = dayStatus === GameStatus.Completed;

    if(upcoming) {
      return `Starts in ${timeRemaining}`;      
    } else if(inProgress) {
      return `Ends in ${timeRemaining}`;            
    } else if(completed) {
      if(endOfDayUpdateComplete) {
        return "Completed";
      }

      return "Finalizing";
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