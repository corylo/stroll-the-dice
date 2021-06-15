import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";

import { Tooltip, TooltipSide } from "../tooltip/tooltip";

interface ButtonProps {
  children?: any;
  className?: string;  
  external?: boolean;
  id?: string;
  styles?: React.CSSProperties;
  tooltip?: string;
  tooltipSide?: TooltipSide;
  url?: string;
  handleOnClick?: () => void;
}

export const Button: React.FC<ButtonProps> = (
  props: ButtonProps
) => {
  const getTooltip = (): JSX.Element => {
    if(props.tooltip) {
      return (
        <Tooltip text={props.tooltip} side={props.tooltipSide || TooltipSide.Right} />
      )
    }
  }

  const getStyles = (): React.CSSProperties => {
    return props.styles || {};
  }

  if(props.url) {
    if(props.external) {
      return (
        <a      
          id={props.id} 
          className={classNames("button link", props.className)} 
          href={props.url}
          style={getStyles()}
          onClick={props.handleOnClick}
        >
          {props.children}
        </a>
      )
    } else {
      return (
        <Link
          id={props.id} 
          className={classNames("button link", props.className)} 
          style={getStyles()}
          to={props.url}
          onClick={props.handleOnClick}
        >
          {props.children}
        </Link>
      )
    }
  }

  if(props.handleOnClick) {
    return (
      <button 
        type="button" 
        id={props.id} 
        className={classNames("button", props.className)} 
        style={getStyles()}
        onClick={props.handleOnClick}
      >
        {props.children}
        {getTooltip()}
      </button>
    );
  }

  return null;
};
