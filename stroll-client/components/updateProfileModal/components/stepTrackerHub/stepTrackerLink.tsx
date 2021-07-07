import React from "react";
import { useHistory } from "react-router-dom";

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
  const history: any = useHistory();

  if(!props.connected) {
    const handleOnClick = (): void => {
      history.replace(StepTrackerUtility.getConnectUrl(props.tracker));

      window.location.href = StepTrackerUtility.getUrl(props.tracker);
    }

    return (
      <Button className="step-tracker-link" handleOnClick={handleOnClick}>
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