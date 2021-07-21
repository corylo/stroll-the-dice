import React from "react";

interface IconStatementProps {  
  icon: string;
  text: string;
}

export const IconStatement: React.FC<IconStatementProps> = (props: IconStatementProps) => {        
  return (
    <span className="icon-statement"><i className={props.icon} /> <span>{props.text}</span></span>
  );
}