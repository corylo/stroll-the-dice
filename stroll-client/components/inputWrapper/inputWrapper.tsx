import React from "react";
import classNames from "classnames";

import { InputLabel } from "./inputLabel";

import { FormError } from "../../enums/formError";

interface InputWrapperProps {
  id?: string;
  label?: string;
  value?: string;
  minLength?: number;
  maxLength?: number;
  error?: FormError;
  errorMessage?: string;
  children: JSX.Element | JSX.Element[];
}

export const InputWrapper: React.FC<InputWrapperProps> = (props: InputWrapperProps) => {
  const getLabel = (): JSX.Element | null => {
    if(props.label) {
      return (
        <InputLabel 
          label={props.label} 
          value={props.value}
          minLength={props.minLength}
          maxLength={props.maxLength}
          error={props.error}
          errorMessage={props.errorMessage}
        />
      )
    }

    return null;
  }

  return(
    <div id={props.id} className={classNames("input-wrapper", { error: props.error })}>
      <div className="input">
        {props.children}
      </div>
      {getLabel()}
    </div>
  )
}