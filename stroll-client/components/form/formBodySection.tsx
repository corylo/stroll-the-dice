import React from "react";

interface FormBodySectionProps {  
  children: any;
}

export const FormBodySection: React.FC<FormBodySectionProps> = (props: FormBodySectionProps) => {  
  return (
    <div className="form-body-section">
      {props.children}
    </div>
  );
}