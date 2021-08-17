import React from "react";
import classNames from "classnames";

import { StepTrackerUtility } from "../../../../utilities/stepTrackerUtility";

import { RequestStatus } from "../../../../../stroll-enums/requestStatus";
import { StepTracker } from "../../../../../stroll-enums/stepTracker";
import { StrollTheDiceCDN } from "../../../../../stroll-enums/strollTheDiceCDN";

interface StepTrackerConnectionStepProps {  
  index: number;
  label: string;
  status: RequestStatus;
  tracker: StepTracker; 
}

export const StepTrackerConnectionStep: React.FC<StepTrackerConnectionStepProps> = (props: StepTrackerConnectionStepProps) => {  
  const logo: string = `${StrollTheDiceCDN.Url}/img/brands/${StepTrackerUtility.getLogo(props.tracker)}`;

  const getIcon = (): string => {
    if(props.status === RequestStatus.Loading) {
      return "fal fa-spinner-third"
    } else if (props.status === RequestStatus.Success) {
      return "fal fa-check";
    } else if (props.status === RequestStatus.Error) {
      return "fal fa-times";
    }
  }

  return (
    <div className={classNames("step-tracker-connection-step", props.status.toLowerCase())}>
      <div className="step-tracker-connection-step-info">
        <h1 className="step-tracker-connection-step-index passion-one-font">{props.index}</h1>
        <img src={logo} />      
        <h1 className="step-tracker-connection-step-label passion-one-font">{props.label}</h1>
      </div>
      <i className={classNames("step-tracker-connection-step-status-icon", getIcon())} />      
    </div>
  );
}