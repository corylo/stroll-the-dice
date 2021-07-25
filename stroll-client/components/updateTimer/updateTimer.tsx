import React from "react";

import { Label } from "../label/label";

import { useCurrentDateEffect } from "../../effects/appEffects";

import { DateUtility } from "../../../stroll-utilities/dateUtility";
import { FirestoreDateUtility } from "../../../stroll-utilities/firestoreDateUtility";

import { ITimeThreshold } from "../../../stroll-models/timeThreshold";

interface UpdateTimerProps { 
  interval: number;
  text?: string;
  textThreshold?: ITimeThreshold;
}

export const UpdateTimer: React.FC<UpdateTimerProps> = (props: UpdateTimerProps) => {      
  useCurrentDateEffect();

  const getText = (): string => {
    if(props.text && props.textThreshold) {
      const { quantity, timestamp, unit } = props.textThreshold;

      if(FirestoreDateUtility.timestampToRelativeOfUnit(timestamp, unit) >= quantity) {
        return props.text;
      }
    }

    return `Update in ${DateUtility.getTimeUntilMinuteOfHour(props.interval)}`;
  }

  return (
    <Label
      className="update-timer passion-one-font"
      icon="fad fa-circle"
      text={getText()}
    />
  );
}