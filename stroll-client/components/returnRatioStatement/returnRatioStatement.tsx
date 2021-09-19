import React from "react";

import { Icon } from "../../../stroll-enums/icon";

interface ReturnRatioStatementProps {  
  ratio: number;
}

export const ReturnRatioStatement: React.FC<ReturnRatioStatementProps> = (props: ReturnRatioStatementProps) => {      
  return (
    <span className="return-ratio-statement"><i className={Icon.Dice} /><span>{`1 : ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(props.ratio)}`}</span></span>
  );
}