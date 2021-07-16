import React from "react";
import classNames from "classnames";

import { LoadingIcon } from "../loadingIcon/loadingIcon";

interface LoadingMessageProps {  
  borderless?: boolean;
  text: string;
}

export const LoadingMessage: React.FC<LoadingMessageProps> = (props: LoadingMessageProps) => {  
  const borderless: boolean = props.borderless !== undefined && props.borderless === true;

  const getBorder = (): JSX.Element => {
    if(!borderless) {
      return (
        <div className="loading-message-border" />  
      )
    }
  }

  return (    
    <div className={classNames("loading-message", { borderless })}>
      {getBorder()}
      <div className="loading-message-content">
        <LoadingIcon />
        <h1 className="passion-one-font">{props.text}</h1>
      </div>
    </div>
  );
}