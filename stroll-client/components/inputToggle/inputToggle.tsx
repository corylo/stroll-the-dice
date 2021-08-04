import React from "react";
import classNames from "classnames";

interface InputToggleProps {  
  className?: string;
  description?: string;
  icon?: string;
  label: string;
  toggled: boolean;
  toggle: (toggled: boolean) => void;
}

export const InputToggle: React.FC<InputToggleProps> = (props: InputToggleProps) => {  
  const getDescription = (): JSX.Element => {
    if(props.description) {
      return (
        <h1 className="input-toggle-description passion-one-font">{props.description}</h1>
      )
    }
  }

  const getIcon = (): JSX.Element => {
    if(props.icon) {
      return (
        <i className={props.icon} />
      )
    }
  }

  return (
    <div className={classNames("input-toggle-wrapper", props.className)}>
      <input 
        type="checkbox" 
        className={classNames({ toggled: props.toggled })}
        checked={props.toggled} 
        onChange={(e: any) => props.toggle(!props.toggled)} 
      />
      <div className="input-toggle">
        <i className={props.toggled ? "fal fa-check-circle" : "fal fa-circle"} />
        <div className="input-toggle-text">
          <div className="input-toggle-label">
            {getIcon()}
            <h1 className="passion-one-font">{props.label}</h1>
          </div>
          {getDescription()}
        </div>
      </div>
    </div>
  );
}