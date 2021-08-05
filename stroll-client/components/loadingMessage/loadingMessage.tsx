import React from "react";
import classNames from "classnames";

import { LoadingIcon } from "../loadingIcon/loadingIcon";

interface LoadingMessageProps {  
  animation?: "blink" | "spin";
  borderless?: boolean;
  text: string;
}

export const LoadingMessage: React.FC<LoadingMessageProps> = (props: LoadingMessageProps) => {  
  const borderless: boolean = props.borderless !== undefined && props.borderless === true;

  return (    
    <div className={classNames("loading-message", { borderless })}>
      <div className="loading-message-content">
        <LoadingIcon animation={props.animation} />
        <h1 className="passion-one-font">{props.text}</h1>
      </div>
    </div>
  );
}