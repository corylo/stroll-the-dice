import React from "react";

import { Icon } from "../../../stroll-enums/icon";

interface PointStatementProps {  
  amount: number | string;
}

export const PointStatement: React.FC<PointStatementProps> = (props: PointStatementProps) => {  
  return (
    <span className="point-statement"><i className={Icon.Points} /> <span className="highlight-main">{props.amount}</span></span>
  );
}