import React, { useContext } from "react";

import { StepTrackerLink } from "./stepTrackerLink";

import { AppContext } from "../../../../components/app/contexts/appContext";

import { StepTrackerUtility } from "../../../../utilities/stepTrackerUtility";

import { RequestStatus } from "../../../../../stroll-enums/requestStatus";
import { StepTracker } from "../../../../../stroll-enums/stepTracker";
import { StrollTheDiceCDN } from "../../../../../stroll-enums/strollTheDiceCDN";

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
      <div className="step-tracker-links">
        <StepTrackerLink                     
          img={`${StrollTheDiceCDN.Url}/img/brands/google-fit-logo.png`} 
          status={getStatus(StepTracker.GoogleFit)}
          tracker={StepTracker.GoogleFit}
          url={StepTrackerUtility.getOAuthUrl(StepTracker.GoogleFit)} 
        />
      </div>
    </div>
  );
}