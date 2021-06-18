import React from "react";
import firebase from "firebase/app";

import { DateUtility } from "../../utilities/dateUtility";

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
      text={`Starts in ${DateUtility.firestoreTimestampToRelative(props.timestamp)}`}
      tooltip={DateUtility.firestoreTimestampToLocale(props.timestamp)}
      tooltipSide={TooltipSide.Bottom}
    />
  );
}