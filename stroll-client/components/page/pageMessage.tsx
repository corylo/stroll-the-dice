import classNames from "classnames";
import React from "react";

interface PageMessageProps {  
  children: any;
  className?: string;
}

export const PageMessage: React.FC<PageMessageProps> = (props: PageMessageProps) => {  
  return (
    <div className={classNames("page-message", props.className)}>
      {props.children}
    </div>
  );
}