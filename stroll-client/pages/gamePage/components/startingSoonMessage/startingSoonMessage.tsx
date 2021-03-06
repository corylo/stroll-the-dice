import React from "react";
import firebase from "firebase/app";

import { LoadingMessage } from "../../../../components/loadingMessage/loadingMessage";

import { useCurrentDateEffect } from "../../../../effects/appEffects";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";

import { GameError } from "../../../../../stroll-enums/gameError";
import { GameStatus } from "../../../../../stroll-enums/gameStatus";

interface StartingSoonMessageProps { 
  limit: number;
  error: GameError;
  startsAt: firebase.firestore.FieldValue;
  status: GameStatus;
}

export const StartingSoonMessage: React.FC<StartingSoonMessageProps> = (props: StartingSoonMessageProps) => {    
  useCurrentDateEffect();

  const withinLimit: boolean = FirestoreDateUtility.timestampToRelativeOfUnit(props.startsAt, "M") <= props.limit;
     
  if(
    props.error === GameError.None &&
    props.status === GameStatus.Upcoming && 
    withinLimit
  ) {
    const startsAtPassed: boolean = FirestoreDateUtility.lessThanOrEqualToNow(props.startsAt); 

    const getText = (): string => {
      if(!startsAtPassed) {
        const timeRemaining: string = FirestoreDateUtility.timestampToRelative(props.startsAt);    
        
        return `Game starting in ${timeRemaining}`;
      } else {
        return "Starting game";
      }
    }

    const getAnimation = (): "spin" | "blink" => startsAtPassed ? "spin" : "blink";

    return (   
      <div className="starting-soon-message">
        <LoadingMessage animation={getAnimation()} text={getText()} />
      </div>
    )
  }

  return null;
}