import React from "react";

import { StepTrackerUtility } from "../../../utilities/stepTrackerUtility";

import { StepTracker } from "../../../../stroll-enums/stepTracker";
import { StrollTheDiceCDN } from "../../../../stroll-enums/strollTheDiceCDN";

interface ConnectAStepTrackerItemProps {  
  tracker: StepTracker;  
}

export const ConnectAStepTrackerItem: React.FC<ConnectAStepTrackerItemProps> = (props: ConnectAStepTrackerItemProps) => {      
  return (
    <div className="connect-a-step-tracker-item">
      <img className="connect-a-step-tracker-logo" src={`${StrollTheDiceCDN.Url}/img/brands/${StepTrackerUtility.getLogo(props.tracker)}`} />
      <h1 className="connect-a-step-tracker-label passion-one-font">{props.tracker}</h1>
    </div>
  );
}