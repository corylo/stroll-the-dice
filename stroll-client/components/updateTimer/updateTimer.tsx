import React from "react";

import { Label } from "../label/label";

import { useCurrentDateEffect } from "../../effects/appEffects";

import { DateUtility } from "../../../stroll-utilities/dateUtility";

interface UpdateTimerProps { 

}

export const UpdateTimer: React.FC<UpdateTimerProps> = (props: UpdateTimerProps) => {      
  useCurrentDateEffect();

  return (
    <Label
      className="update-timer passion-one-font"
      icon="fad fa-circle"
      text={`Update in ${DateUtility.getTimeUntilInterval(30)}`}
    />
  );
}