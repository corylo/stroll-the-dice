import React, { useContext } from "react";

import { ConnectAStepTrackerItem } from "./connectAStepTrackerItem/connectAStepTrackerItem";

import { AppContext } from "../app/contexts/appContext";

import { ImageUtility } from "../../utilities/imageUtility";

import { StepTracker } from "../../../stroll-enums/stepTracker";

interface ConnectAStepTrackerMessageProps {  
  
}

export const ConnectAStepTrackerMessage: React.FC<ConnectAStepTrackerMessageProps> = (props: ConnectAStepTrackerMessageProps) => {    
  const { tracker } = useContext(AppContext).appState.user.profile;

  if(tracker.name === StepTracker.Unknown) {
    return (
      <div className="connect-a-step-tracker-message" style={{ backgroundImage: `url(${ImageUtility.getGraphic("park", "png")})`}}>
        <div className="connect-a-step-tracker-message-content">
          <div className="connect-a-step-tracker-items">
            <ConnectAStepTrackerItem tracker={StepTracker.GoogleFit} />
            <ConnectAStepTrackerItem tracker={StepTracker.Fitbit} />
          </div>
          <h1 className="connect-a-step-tracker-message-label passion-one-font">Looks like you need to connect a step tracker!</h1>
        </div>
      </div>
    );
  }

  return null;
}