import React from "react";
import classNames from "classnames";

export enum TooltipSide {
  Bottom = "bottom",
  BottomLeft = "bottom-left",
  BottomRight = "bottom-right",
  Left = "left",
  Right = "right",
  Top = "top"
}

interface TooltipProps {
  text: string;
  side: TooltipSide;
}

export const Tooltip: React.FC<TooltipProps> = (props: TooltipProps) => {
  const classes: string = classNames("tooltip", props.side);

  return(
    <div className={classes}>
      <h1 className="passion-one-font">{props.text}</h1>
    </div>
  )
}