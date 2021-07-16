import React from "react";
import classNames from "classnames";

interface FormBodySectionProps {  
  children: any;
  className?: string;
}

export const FormBodySection: React.FC<FormBodySectionProps> = (props: FormBodySectionProps) => {  
  return (
    <div className={classNames("form-body-section", props.className)}>
      {props.children}
    </div>
  );
}