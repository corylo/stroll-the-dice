import React from "react";
import classNames from "classnames";

import { Button } from "../../buttons/button";

import { StepTrackerUtility } from "../../../utilities/stepTrackerUtility";
import { UrlUtility } from "../../../utilities/urlUtility";

import { StepTracker } from "../../../../stroll-enums/stepTracker";
import { StrollTheDiceCDN } from "../../../../stroll-enums/strollTheDiceCDN";

interface ConnectAStepTrackerItemProps {  
  tracker: StepTracker;  
}

export const ConnectAStepTrackerItem: React.FC<ConnectAStepTrackerItemProps> = (props: ConnectAStepTrackerItemProps) => {      
  return (
    <Button className={classNames("connect-a-step-tracker-item fancy-button", UrlUtility.format(props.tracker))} url="/profile">
      <img className="connect-a-step-tracker-logo" src={`${StrollTheDiceCDN.Url}/img/brands/${StepTrackerUtility.getFullLogo(props.tracker)}`} />      
    </Button>
  );
}