import React from "react";

import { Label } from "../label/label";

import { GameDurationUtility } from "../../../stroll-utilities/gameDurationUtility";

import { GameStatus } from "../../../stroll-enums/gameStatus";

interface GameDayStatusProps { 
  status: GameStatus;
}

export const GameDayStatus: React.FC<GameDayStatusProps> = (props: GameDayStatusProps) => {    
  const { status } = props;
  
  const getText = (): string => {
    if(status === GameStatus.Completed) {
      return "Completed";
    } else if(status === GameStatus.InProgress) {
      return `Ends in ${GameDurationUtility.getTimeRemainingInToday()}`;      
    } else if(status === GameStatus.Upcoming) {
      return `Starts in ${GameDurationUtility.getTimeRemainingInToday()}`;      
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