import React, { useContext } from "react";

import { Label } from "../../../label/label";
import { StepTrackerLink } from "./stepTrackerLink";

import { AppContext } from "../../../app/contexts/appContext";

import { StepTrackerUtility } from "../../../../utilities/stepTrackerUtility";

import { StepTracker } from "../../../../../stroll-enums/stepTracker";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface StepTrackerHubProps {  
  
}

export const StepTrackerHub: React.FC<StepTrackerHubProps> = (props: StepTrackerHubProps) => {  
  const { appState } = useContext(AppContext);

  const { statuses, user } = appState;

  const getStatus = (tracker: StepTracker): RequestStatus => {
    if(user.profile.tracker === tracker) {
      if(statuses.tracker.is === RequestStatus.Idle || statuses.tracker.is === RequestStatus.Success) {
        return RequestStatus.Success;
      }
      
      return statuses.tracker.is;
    }

    return RequestStatus.Idle;
  }
  
  return (
    <div className="step-tracker-hub">
      <div className="step-tracker-hub-label">
        <Label className="passion-one-font" text="Connect Step Trackers" />
      </div>
      <div className="step-tracker-links">
        <StepTrackerLink                     
          img="/img/brands/google-fit-logo.png" 
          status={getStatus(StepTracker.GoogleFit)}
          tracker={StepTracker.GoogleFit}
          url={StepTrackerUtility.getOAuthUrl(StepTracker.GoogleFit)} 
        />
      </div>
    </div>
  );
}