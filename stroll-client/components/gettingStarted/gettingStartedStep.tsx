import React from "react";
import classNames from "classnames";

import { IconButton } from "../buttons/iconButton";

interface GettingStartedStepProps {  
  completed: boolean;
  index: number;
  label: string;
  handleOnAction: () => void;
}

export const GettingStartedStep: React.FC<GettingStartedStepProps> = (props: GettingStartedStepProps) => {   
  const getActionButton = (): JSX.Element => {
    if(!props.completed) {
      return (
        <IconButton 
          className="getting-started-action-button" 
          icon="fal fa-arrow-right" 
          handleOnClick={props.handleOnAction} 
          tooltip="Go"
        />        
      )
    }
  }
  
  return (
    <div className={classNames("getting-started-step", { completed: props.completed })}>
      <div className="getting-started-step-content">
        <h1 className="getting-started-step-index passion-one-font">{props.index}</h1>
        <h1 className="getting-started-step-label passion-one-font">{props.label}</h1>
        {getActionButton()}
      </div>
      <i className={classNames("getting-started-status-icon", { "fal fa-check-circle": props.completed, "fal fa-circle": !props.completed })} />
    </div>
  );
}