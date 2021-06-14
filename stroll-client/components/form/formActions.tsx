import React from "react";

interface FormActionsProps {  
  children: any;
}

export const FormActions: React.FC<FormActionsProps> = (props: FormActionsProps) => {  
  return (
    <div className="form-actions">
      {props.children}
    </div>
  );
}