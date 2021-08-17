import React, { useContext } from "react";

import { Button } from "../buttons/button";

import { AppContext } from "../app/contexts/appContext";

import { StepTrackerUtility } from "../../utilities/stepTrackerUtility";

import { StepTracker } from "../../../stroll-enums/stepTracker";
import { StrollTheDiceCDN } from "../../../stroll-enums/strollTheDiceCDN";

interface ConnectAStepTrackerMessageProps {  
  
}

export const ConnectAStepTrackerMessage: React.FC<ConnectAStepTrackerMessageProps> = (props: ConnectAStepTrackerMessageProps) => {    
  const { tracker } = useContext(AppContext).appState.user.profile;

  if(tracker.name === StepTracker.Unknown) {
    return (
      <div className="connect-a-step-tracker-message">
        <h1 className="connect-a-step-tracker-message-label passion-one-font">Looks like you need to connect a step tracker!</h1>
        <div className="connect-a-step-tracker-items">
          <div className="connect-a-step-tracker-item">
            <img className="connect-a-step-tracker-logo" src={`${StrollTheDiceCDN.Url}/img/brands/${StepTrackerUtility.getLogo(StepTracker.GoogleFit)}`} />
            <h1 className="connect-a-step-tracker-label passion-one-font">{StepTracker.GoogleFit}</h1>
          </div>
          <div className="connect-a-step-tracker-item">
            <img className="connect-a-step-tracker-logo" src={`${StrollTheDiceCDN.Url}/img/brands/${StepTrackerUtility.getLogo(StepTracker.Fitbit)}`} />
            <h1 className="connect-a-step-tracker-label passion-one-font">{StepTracker.Fitbit}</h1>
          </div>
        </div>
        <Button className="go-to-profile-button fancy-button" url="/profile">
          <h1 className="passion-one-font">Go to profile</h1>
        </Button>
      </div>
    );
  }

  return null;
}