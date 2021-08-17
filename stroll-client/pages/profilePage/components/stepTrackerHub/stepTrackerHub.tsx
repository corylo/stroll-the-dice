import React from "react";

import { StepTrackerLink } from "./stepTrackerLink";

import { StepTracker } from "../../../../../stroll-enums/stepTracker";

interface StepTrackerHubProps {  
  toggleModal: (toggled: boolean) => void;
}

export const StepTrackerHub: React.FC<StepTrackerHubProps> = (props: StepTrackerHubProps) => {  
  return (
    <div className="step-tracker-hub">
      <div className="step-tracker-links">
        <StepTrackerLink tracker={StepTracker.GoogleFit} toggleModal={props.toggleModal} />
        <StepTrackerLink tracker={StepTracker.Fitbit} toggleModal={props.toggleModal}  />
      </div>
    </div>
  );
}