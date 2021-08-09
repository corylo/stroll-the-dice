import React from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import { LoadingIcon } from "../loadingIcon/loadingIcon";

import { useDisableScrollEffect } from "../../effects/appEffects";

import { FormStatus } from "../../enums/formStatus";
import { RequestStatus } from "../../../stroll-enums/requestStatus";

interface ModalProps {
  id: string;
  children: any;
  priority?: boolean;
  status?: RequestStatus | FormStatus;
}

export const Modal: React.FC<ModalProps> = (props: ModalProps) => {
  useDisableScrollEffect();

  const getClasses = (): string => {
    return classNames(
      "modal-wrapper", 
      "scroll-bar", { 
      priority: props.priority
    });
  }

  const getModalContent = (): JSX.Element => {
    if(props.status === RequestStatus.Loading || props.status === FormStatus.Submitting) {
      return (
        <LoadingIcon />
      )
    }

    return (
      <div id={`${props.id}-content`} className="modal-content-wrapper" onClick={(e: any) => e.stopPropagation()}>
        <div className="modal-content">
          {props.children}
        </div>
      </div>
    )
  }

  return ReactDOM.createPortal(
    <div id={props.id} className={getClasses()}>
      {getModalContent()}
    </div>,
    document.body
  );
}