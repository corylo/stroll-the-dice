import React from "react";

import { Button } from "../../../buttons/button";
import { IconButton } from "../../../buttons/iconButton";

import { StepTrackerUtility } from "../../../../utilities/stepTrackerUtility";

import { StepTracker } from "../../../../../stroll-enums/stepTracker";

interface StepTrackerLinkProps {    
  connected: boolean;
  img: string;
  tracker: StepTracker;
  url: string;
}

export const StepTrackerLink: React.FC<StepTrackerLinkProps> = (props: StepTrackerLinkProps) => {  
  if(!props.connected) {
    return (
      <Button className="step-tracker-link" url={StepTrackerUtility.getOAuthUrl(props.tracker)} external>
        <img src={props.img} />      
        <h1 className="passion-one-font">{props.tracker}</h1>
      </Button>
    );
  }

  return (
    <div className="connected-step-tracker-link">
      <img src={props.img} />      
      <h1 className="passion-one-font">{props.tracker}<span className="highlight-main">Connected</span></h1>
      <IconButton className="disconnect-step-tracker-button" icon="fal fa-times" handleOnClick={() => {}} />
    </div>
  )
}