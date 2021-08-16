import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";

import { Tooltip, TooltipSide } from "../tooltip/tooltip";

interface ButtonProps {
  children?: any;
  className?: string;  
  disabled?: boolean;
  external?: boolean;
  id?: string;
  newtab?: boolean;
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
          className={classNames("button link", { disabled: props.disabled }, props.className)} 
          href={!props.disabled ? props.url : ""}
          style={getStyles()}
          tabIndex={!props.disabled ? 0 : -1}
          target={props.newtab ? "_blank" : "_self"}
          onClick={!props.disabled ? props.handleOnClick : null}
        >
          {props.children}
        </a>
      )
    } else {
      return (
        <Link
          id={props.id} 
          className={classNames("button link", { disabled: props.disabled }, props.className)} 
          style={getStyles()}
          tabIndex={!props.disabled ? 0 : -1}
          to={!props.disabled ? props.url : ""}
          onClick={!props.disabled ? props.handleOnClick : null}
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
        disabled={props.disabled !== undefined && props.disabled === true}
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
