import React from "react";

import { Label } from "../label/label";

import { useCurrentDateEffect } from "../../effects/appEffects";

import { DateUtility } from "../../../stroll-utilities/dateUtility";

interface UpdateTimerProps { 
  interval: number;
  getText: (time: string) => string;
}

export const UpdateTimer: React.FC<UpdateTimerProps> = (props: UpdateTimerProps) => {      
  useCurrentDateEffect();

  return (
    <Label
      className="update-timer passion-one-font"
      icon="fad fa-circle"
      text={props.getText(DateUtility.getTimeUntilMinuteOfHour(props.interval))}
    />
  );
}