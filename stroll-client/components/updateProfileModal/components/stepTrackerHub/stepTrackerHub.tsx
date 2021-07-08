import React, { useContext } from "react";

import { Label } from "../../../label/label";
import { StepTrackerLink } from "./stepTrackerLink";

import { AppContext } from "../../../app/contexts/appContext";

import { StepTrackerUtility } from "../../../../utilities/stepTrackerUtility";

import { StepTracker } from "../../../../../stroll-enums/stepTracker";

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
          connected={appState.user.profile.tracker === StepTracker.Fitbit}
          img="/img/brands/fitbit-logo.png" 
          tracker={StepTracker.Fitbit}
          url={StepTrackerUtility.getOAuthUrl(StepTracker.Fitbit)} 
        />
      </div>
    </div>
  );
}