import React from "react";

import { LoadingIcon } from "../loadingIcon/loadingIcon";

import { FormError } from "../../enums/formError";
import { FormStatus } from "../../enums/formStatus";

interface FormProps {  
  children: any;
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
    console.log(props.status, props.statusMessage);

    if(props.status === FormStatus.SubmitInfo) {
      const infoMessage: string = props.statusMessage || "Info!";

      return (
        <div className="form-submit-info-message">
          <h1 className="passion-one-font">{infoMessage}</h1>
        </div>
      )
    } else if(props.status === FormStatus.SubmitSuccess) {
      const successMessage: string = props.statusMessage || "Success!";

      return (
        <div className="form-submit-success-message">
          <h1 className="passion-one-font">{successMessage}</h1>
        </div>
      )
    } else if(props.status === FormStatus.SubmitError) {
      const errorMessage: string = props.statusMessage || "Whoops! Unable to complete request. Please Refresh And Try Again.";

      return (
        <div className="form-submit-error-message">
          <h1 className="passion-one-font">{errorMessage}</h1>
        </div>
      )
    }
  }

  return (
    <div id={props.id} className="form">
      {getFormContent()}      
      {getFormErrorMessage()}
      {getSubmitStatusMessage()}
    </div>
  );
}