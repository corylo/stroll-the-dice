import React from "react";

import { Icon } from "../../../stroll-enums/icon";

interface PointStatementProps {  
  amount?: number | string;
}

export const PointStatement: React.FC<PointStatementProps> = (props: PointStatementProps) => {  
  const amount: JSX.Element = props.amount !== undefined
    ? <span>{props.amount}</span>
    : null;
    
  return (
    <span className="point-statement"><i className={Icon.Points} /> <span>{amount}</span></span>
  );
}