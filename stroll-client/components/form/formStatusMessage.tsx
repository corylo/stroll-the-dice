import React from "react";
import classNames from "classnames";

import { FormStatus } from "../../enums/formStatus";

interface FormStatusMessageProps {  
  status: FormStatus;
  text?: string;
}

export const FormStatusMessage: React.FC<FormStatusMessageProps> = (props: FormStatusMessageProps) => {  
  const getText = (): string => {
    if(props.text) {
      return props.text;
    }

    if(props.status === FormStatus.SubmitInfo) {
      return "Info!";
    } else if(props.status === FormStatus.SubmitSuccess) {
      return "Success!";
    } else if(props.status === FormStatus.SubmitError) {
      return "Error!";
    }      
  }

  const classes: string = classNames({
    "form-submit-info-message": props.status === FormStatus.SubmitInfo,
    "form-submit-success-message": props.status === FormStatus.SubmitSuccess,
    "form-submit-error-message": props.status === FormStatus.SubmitError
  });

  return (
    <div className={classes}>
      <h1 className="passion-one-font">{getText()}</h1>
    </div>
  );
}