import React, { useEffect, useState } from "react";
import classNames from "classnames";

import { Tooltip, TooltipSide } from "../tooltip/tooltip";

interface AnimatedCounterProps {  
  className?: string;
  initialValue: number;
  tooltip?: string;
  tooltipSide?: TooltipSide;
  value: number;
  formatValue?: (value: number) => string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = (props: AnimatedCounterProps) => {  
  const [value, setValue] = useState<number>(props.initialValue);

  useEffect(() => {
    let iter: number = 0;

    const interval: NodeJS.Timeout = setInterval(() => {
      if(value < props.value) {
        let updatedValue: number = value;

        if(props.value - value >= 1000000) {
          updatedValue += 500000;
        } else if(props.value - value >= 100000) {
          updatedValue += 50000;
        } else if(props.value - value >= 1000) {
          updatedValue += 500;
        } else if (props.value - value >= 100) {
          updatedValue += 50;
        } else if (props.value - value >= 10) {
          updatedValue += 5;
        } else if (props.value - value >= 1) {
          updatedValue += 1;
        } else if (props.value - value >= 0.1) {
          updatedValue += 0.1;
        } else {
          updatedValue += 0.01;
        }

        iter = iter + 1;

        setValue(updatedValue);
      } else {
        clearInterval(interval);
      }
    }, 5);

    return () => {
      clearInterval(interval);
    }
  }, [props.value, value]);

  const getValue = (): number | string => {
    if(props.formatValue) {
      return props.formatValue(value);
    }

    return value;
  }

  const getTooltip = (): JSX.Element => {
    if(props.tooltip) {
      return (
        <Tooltip text={props.tooltip} side={props.tooltipSide || TooltipSide.Right} />
      )
    }
  }

  return (
    <div className={classNames("animated-counter", props.className)}>
      <h1 className="passion-one-font">{getValue()}</h1>
      {getTooltip()}
    </div>
  );
}