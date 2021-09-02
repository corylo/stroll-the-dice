import React, { useContext } from "react";

import { Button } from "../buttons/button";
import { ConnectAStepTrackerItem } from "./connectAStepTrackerItem/connectAStepTrackerItem";

import { AppContext } from "../app/contexts/appContext";

import { StepTracker } from "../../../stroll-enums/stepTracker";

interface ConnectAStepTrackerMessageProps {  
  
}

export const ConnectAStepTrackerMessage: React.FC<ConnectAStepTrackerMessageProps> = (props: ConnectAStepTrackerMessageProps) => {    
  const { tracker } = useContext(AppContext).appState.user.profile;

  if(tracker.name === StepTracker.Unknown) {
    return (
      <div className="connect-a-step-tracker-message">
        <h1 className="connect-a-step-tracker-message-label passion-one-font">Looks like you need to connect a step tracker!</h1>
        <div className="connect-a-step-tracker-items">
          <ConnectAStepTrackerItem tracker={StepTracker.GoogleFit} />
          <ConnectAStepTrackerItem tracker={StepTracker.Fitbit} />
        </div>
        <Button className="go-to-profile-button fancy-button" url="/profile">
          <h1 className="passion-one-font">Go to profile</h1>
        </Button>
      </div>
    );
  }

  return null;
}