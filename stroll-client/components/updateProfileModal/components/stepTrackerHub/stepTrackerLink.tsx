import React from "react";

import { Button } from "../../../buttons/button";
import { IconButton } from "../../../buttons/iconButton";

import { StepTrackerUtility } from "../../../../utilities/stepTrackerUtility";

import { RequestStatus } from "../../../../../stroll-enums/requestStatus";
import { StepTracker } from "../../../../../stroll-enums/stepTracker";

interface StepTrackerLinkProps {    
  img: string;
  status: RequestStatus;
  tracker: StepTracker;
  url: string;
}

export const StepTrackerLink: React.FC<StepTrackerLinkProps> = (props: StepTrackerLinkProps) => {  
  if(props.status === RequestStatus.Idle) {    
    return (
      <Button className="step-tracker-link" url={StepTrackerUtility.getOAuthUrl(props.tracker)} external>
        <img src={props.img} />      
        <h1 className="passion-one-font">{props.tracker}</h1>
      </Button>
    );
  }

  const getConnectedStepTrackerLinkContent = (): JSX.Element => {
    if(props.status === RequestStatus.Loading) {
      return (
        <React.Fragment>
          <h1 className="passion-one-font">{props.tracker}</h1>
          <i className="connecting-icon fal fa-spinner-third" />
        </React.Fragment>
      )
    } else if (props.status === RequestStatus.Success) {
      return (
        <React.Fragment>
          <h1 className="passion-one-font">{props.tracker}<span className="highlight-main">Connected</span></h1>
          <IconButton className="disconnect-step-tracker-button" icon="fal fa-times" handleOnClick={() => {}} />
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <h1 className="passion-one-font">{props.tracker}<span className="highlight-error">Error Connecting</span></h1>
      </React.Fragment>
    )
  }

  return (
    <div className="connected-step-tracker-link">
      <img src={props.img} />      
      {getConnectedStepTrackerLinkContent()}
    </div>
  )
}