import React, { useContext } from "react";

import { Label } from "../../../label/label";
import { StepTrackerLink } from "./stepTrackerLink";

import { StepTrackerUtility } from "../../../../utilities/stepTrackerUtility";

import { StepTracker } from "../../../../../stroll-enums/stepTracker";
import { AppContext } from "../../../app/contexts/appContext";

interface StepTrackerHubProps {  
  
}

export const StepTrackerHub: React.FC<StepTrackerHubProps> = (props: StepTrackerHubProps) => {  
  const { appState } = useContext(AppContext);

  return (
    <div className="step-tracker-hub">
      <div className="step-tracker-hub-label">
        <Label className="passion-one-font" text="Connect Step Trackers" />
      </div>
      <div className="step-tracker-links">
        <StepTrackerLink           
          connected={appState.tracker && appState.tracker.name === StepTracker.Fitbit}
          img="/img/brands/fitbit-logo.png" 
          tracker={StepTracker.Fitbit}
          url={StepTrackerUtility.getUrl(StepTracker.Fitbit)} 
        />
      </div>
    </div>
  );
}