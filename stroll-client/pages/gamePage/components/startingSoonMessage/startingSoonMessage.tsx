import React from "react";
import firebase from "firebase/app";

import { LoadingMessage } from "../../../../components/loadingMessage/loadingMessage";

import { useCurrentDateEffect } from "../../../../effects/appEffects";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";
import { GameStatus } from "../../../../../stroll-enums/gameStatus";

interface StartingSoonMessageProps { 
  day: number;
  limit: number;
  startsAt: firebase.firestore.FieldValue;
  status: GameStatus;
}

export const StartingSoonMessage: React.FC<StartingSoonMessageProps> = (props: StartingSoonMessageProps) => {    
  useCurrentDateEffect();
     
  if(props.status === GameStatus.Upcoming) {
    const getText = (): string => {
      if(props.day === 0 && FirestoreDateUtility.timestampToRelativeOfUnit(props.startsAt, "M") <= props.limit) {
        const timeRemaining: string = FirestoreDateUtility.timestampToRelative(props.startsAt);    
        
        return `Game starting in ${timeRemaining}`;
      } else if(props.day === 1) {
        return "Starting game";
      }
    }

    return (   
      <div className="starting-soon-message">
        <div className="starting-soon-message-border" />
        <LoadingMessage text={getText()} />
        <div className="starting-soon-message-border" />
      </div>
    )
  }

  return null;
}