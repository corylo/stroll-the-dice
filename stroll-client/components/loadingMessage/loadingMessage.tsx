import React from "react";

import { LoadingIcon } from "../loadingIcon/loadingIcon";

interface LoadingMessageProps {  
  text: string;
}

export const LoadingMessage: React.FC<LoadingMessageProps> = (props: LoadingMessageProps) => {  
  return (    
    <div className="loading-message">
      <LoadingIcon />
      <h1 className="passion-one-font">{props.text}</h1>
    </div>
  );
}