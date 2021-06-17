import React from "react";

import { FormError } from "../../enums/formError";

interface InputLabelProps {
  label: string;
  value?: string;
  minLength?: number;
  maxLength?: number;
  error?: FormError;
  errorMessage?: string;
}

export const InputLabel: React.FC<InputLabelProps> = (props: InputLabelProps) => {
  const getMaxLength = (): JSX.Element | null => {
    if(props.value !== undefined && props.maxLength !== undefined) {
      return (
        <h1 className="max-length">({props.value.length} / {props.maxLength})</h1>
      )
    }

    return null;
  }
  const getErrorMessage = (): JSX.Element | null => {
    if(props.error) {
      const getMessage = (): string => {
        if(props.errorMessage) {
          return props.errorMessage;
        } else if (props.error === FormError.CharacterMinimumNotMet) {
          return `${props.minLength} Chars Minimum`;
        } else if (props.error === FormError.InvalidValue) {
          return FormError.InvalidValue;
        }
        
        return "Field Required";
      }
      
      return (
        <h1 className="error-message">{getMessage()}</h1>
      )
    }

    return null;
  }

  return(
    <div className="input-label passion-one-font">
      <h1>{props.label}</h1>
      {getMaxLength()}
      {getErrorMessage()}
    </div>
  )
}