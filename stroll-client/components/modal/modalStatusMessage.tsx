import React from "react";
import classNames from "classnames";

import { RequestStatus } from "../../../stroll-enums/requestStatus";

interface ModalStatusMessageProps {  
  status: RequestStatus;
  statusMessage: string;
}

export const ModalStatusMessage: React.FC<ModalStatusMessageProps> = (props: ModalStatusMessageProps) => {  
  if(props.status === RequestStatus.Success || props.status === RequestStatus.Error) {
    return (    
      <div className={classNames("modal-status-message", props.status.toLowerCase())}>
        <h1 className="passion-one-font">{props.statusMessage}</h1>
      </div>
    );
  }

  return null;
}