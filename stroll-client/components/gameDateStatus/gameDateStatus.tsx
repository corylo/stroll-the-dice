import React from "react";

import { Label } from "../label/label";

import { FirestoreDateUtility } from "../../../stroll-utilities/firestoreDateUtility";
import { GameDurationUtility } from "../../../stroll-utilities/gameDurationUtility";

import { useCurrentDateEffect } from "../../effects/appEffects";

import { IGame } from "../../../stroll-models/game";

import { GameError } from "../../../stroll-enums/gameError";
import { GameStatus } from "../../../stroll-enums/gameStatus";

interface GameDateStatusProps {  
  game: IGame;
}

export const GameDateStatus: React.FC<GameDateStatusProps> = (props: GameDateStatusProps) => {    
  const { game } = props;

  useCurrentDateEffect();

  const getText = (): string => {
    if(game.error === GameError.PlayerMinimumNotMet) {
      return "Not Started";
    } else if(game.status === GameStatus.Completed) {
      return "Completed";
    } else if(game.status === GameStatus.InProgress) {
      if(FirestoreDateUtility.lessThanOrEqualToNow(game.endsAt)) {
        return "Finalizing";
      }

      return `Ends in ${GameDurationUtility.getTimeRemaining(game)}`;
    } else if (game.status === GameStatus.Upcoming) {
      if(FirestoreDateUtility.lessThanOrEqualToNow(game.startsAt)) {
        return "Starting";
      }

      return `Starts in ${FirestoreDateUtility.timestampToRelative(game.startsAt)}`;
    }
  }

  return (
    <Label
      className="game-date-status date-status passion-one-font"
      icon="fal fa-clock"
      text={getText()}
    />
  );
}