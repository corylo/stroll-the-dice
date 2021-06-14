import React from "react";

interface FormTitleProps {  
  text?: string;
  children?: any;
}

export const FormTitle: React.FC<FormTitleProps> = (props: FormTitleProps) => {
  const getChildren = (): any => {
    if(props.children) {
      return props.children;
    }
  }

  const getText = (): JSX.Element => {
    if(props.text) {
      return (
        <h1 className="passion-one-font">{props.text}</h1>
      )
    }
  }

  return (
    <div className="form-title">
      {getText()}
      {getChildren()}
    </div>
  );
}