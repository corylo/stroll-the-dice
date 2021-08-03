import React from "react";
import classNames from "classnames";

import { FormStatusMessage } from "./formStatusMessage";
import { LoadingIcon } from "../loadingIcon/loadingIcon";

import { FormError } from "../../enums/formError";
import { FormStatus } from "../../enums/formStatus";

interface FormProps {  
  children: any;
  className?: string;
  errors?: any;
  id?: string;  
  status?: FormStatus;
  statusMessage?: string;
}

export const Form: React.FC<FormProps> = (props: FormProps) => {  
  const getFormContent = (): JSX.Element => {
    if(props.status === FormStatus.Submitting) {
      return (
        <LoadingIcon />
      )
    }

    return props.children;
  }

  const getFormErrorMessage = (): JSX.Element | null => {
    if(props.errors) {
      const errorCount: number = Object.entries(props.errors)
        .map((entry: any) => ({ key: entry[0], value: entry[1] }))
        .filter((entry: any) => entry.value !== FormError.None)
        .length;

      if(errorCount > 0) {
        const message: string = errorCount === 1 
          ? "There is an error that needs to be fixed"
          : `There are ${errorCount} errors that need to be fixed`;

        return (
          <div className="form-error-message">
            <h1 className="passion-one-font">{message}</h1>
          </div>
        )
      }
    }

    return null;
  }
  
  const getSubmitStatusMessage = (): JSX.Element | null => {
    if(props.status !== FormStatus.InProgress && props.status !== FormStatus.Submitting) {
      return (
        <FormStatusMessage status={props.status} text={props.statusMessage} />
      )
    }
  }

  return (
    <div id={props.id} className={classNames("form", props.className)}>
      {getFormContent()}      
      {getFormErrorMessage()}
      {getSubmitStatusMessage()}
    </div>
  );
}