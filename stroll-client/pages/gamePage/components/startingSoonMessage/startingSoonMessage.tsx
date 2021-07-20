import React from "react";
import firebase from "firebase/app";

import { LoadingMessage } from "../../../../components/loadingMessage/loadingMessage";

import { useCurrentDateEffect } from "../../../../effects/appEffects";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";

import { GameStatus } from "../../../../../stroll-enums/gameStatus";

interface StartingSoonMessageProps { 
  limit: number;
  startsAt: firebase.firestore.FieldValue;
  status: GameStatus;
}

export const StartingSoonMessage: React.FC<StartingSoonMessageProps> = (props: StartingSoonMessageProps) => {    
  useCurrentDateEffect();

  const withinLimit: boolean = FirestoreDateUtility.timestampToRelativeOfUnit(props.startsAt, "M") <= props.limit;
     
  if(props.status === GameStatus.Upcoming && withinLimit) {
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
        <div className="starting-soon-message-border" />
        <LoadingMessage animation={getAnimation()} text={getText()} />
      </div>
    )
  }

  return null;
}