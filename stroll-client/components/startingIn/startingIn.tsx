import React from "react";
import firebase from "firebase/app";

import { FirestoreDateUtility } from "../../utilities/firestoreDateUtility";

import { Label } from "../label/label";
import { TooltipSide } from "../tooltip/tooltip";

interface StartingInProps {  
  timestamp: firebase.firestore.FieldValue;
}

export const StartingIn: React.FC<StartingInProps> = (props: StartingInProps) => {  
  return (
    <Label
      className="starting-in passion-one-font"
      icon="fal fa-clock"
      text={`Starts in ${FirestoreDateUtility.timestampToRelative(props.timestamp)}`}
      tooltip={FirestoreDateUtility.timestampToLocale(props.timestamp)}
      tooltipSide={TooltipSide.Bottom}
    />
  );
}