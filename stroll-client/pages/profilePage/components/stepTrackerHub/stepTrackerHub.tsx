import React from "react";

import { StepTrackerLink } from "./stepTrackerLink";

import { StepTracker } from "../../../../../stroll-enums/stepTracker";

interface StepTrackerHubProps {  
  
}

export const StepTrackerHub: React.FC<StepTrackerHubProps> = (props: StepTrackerHubProps) => {  
  return (
    <div className="step-tracker-hub">
      <div className="step-tracker-links">
        <StepTrackerLink tracker={StepTracker.GoogleFit} />
        <StepTrackerLink tracker={StepTracker.Fitbit} />
      </div>
    </div>
  );
}