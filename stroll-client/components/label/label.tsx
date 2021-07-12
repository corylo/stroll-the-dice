import React from "react";
import classNames from "classnames";

import { Tooltip, TooltipSide } from "../tooltip/tooltip";

interface LabelProps { 
  className?: string; 
  icon?: string;
  styles?: React.CSSProperties;
  text?: string;
  tooltip?: string;
  tooltipSide?: TooltipSide;
  handleOnClick?: () => void;
}

export const Label: React.FC<LabelProps> = (props: LabelProps) => {  
  const getTooltip = (): JSX.Element => {
    if(props.tooltip) {
      return (
        <Tooltip text={props.tooltip} side={props.tooltipSide || TooltipSide.Right} />
      )
    }
  }

  const getButton = (): JSX.Element => {
    if(props.handleOnClick) {
      return (
        <button type="button" onClick={props.handleOnClick} />
      )
    }
  }

  const getStyles = (): React.CSSProperties => {
    if(props.styles) {
      return props.styles;
    }
  }

  if(props.text && props.icon) {
    return (
      <div className={classNames("label", "combo", props.className)}>
        <i className={props.icon} style={getStyles()} />
        <div className="label-text-wrapper">
          <h1 className="passion-one-font" style={getStyles()}>{props.text}</h1>         
          {getTooltip()}
        </div>
        {getButton()}  
      </div>
    )
  } else if(props.text) {
    return (
      <div className={classNames("label", props.className)}>
        <h1 style={getStyles()} className="passion-one-font">{props.text}</h1>
        {getButton()}     
        {getTooltip()} 
      </div>
    );
  } else if (props.icon) {
    return (
      <i className={classNames("label", props.icon, props.className)} style={getStyles()}>  
        {getButton()}         
        {getTooltip()}   
      </i>
    );
  }

  throw new Error("icon or text property required.");
}