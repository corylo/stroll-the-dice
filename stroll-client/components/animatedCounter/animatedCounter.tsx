import React, { useEffect, useState } from "react";
import classNames from "classnames";

import { Tooltip, TooltipSide } from "../tooltip/tooltip";

interface AnimatedCounterProps {  
  className?: string;
  initialValue?: number;
  tooltip?: string;
  tooltipSide?: TooltipSide;
  value: number;
  formatValue?: (value: number) => string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = (props: AnimatedCounterProps) => {  
  const [value, setValue] = useState<number>(props.initialValue || 0);

  const getIncrement = (diff: number): number => {
    if(diff <= 0.1) {
      return parseFloat((value + 0.01).toFixed(2));
    } else if (diff < 1) {
      return parseFloat((value + 0.1).toFixed(1));
    } else if (diff <= 100) {
      return value + 1;
    } else if (diff <= 1000) {
      return value + 10;
    } else if (diff <= 10000) {
      return value + 100;
    } else if (diff <= 100000) {
      return value + 1000;
    } else if (diff <= 1000000) {
      return value + 10000;
    } else if (diff <= 10000000) {
      return value + 100000;
    }
  
    return value + 1000000;
  }
  
  const getDecrement = (diff: number): number => {
    diff = Math.abs(diff);

    if(diff <= 0.1) {
      return parseFloat((value - 0.01).toFixed(2));
    } else if (diff < 1) {
      return parseFloat((value - 0.1).toFixed(1));
    } else if (diff <= 100) {
      return value - 1;
    } else if (diff <= 1000) {
      return value - 10;
    } else if (diff <= 10000) {
      return value - 100;
    } else if (diff <= 100000) {
      return value - 1000;
    } else if (diff <= 1000000) {
      return value - 10000;
    } else if (diff <= 10000000) {
      return value - 100000;
    }
  
    return value - 1000000;
  }
  
  useEffect(() => {
    const interval: NodeJS.Timeout = setInterval(() => {
      let diff: number = parseFloat((props.value - value).toFixed(2));

      if(diff > 0) {
        setValue(getIncrement(diff));
      } else if (diff < 0) {
        setValue(getDecrement(diff));
      } else {
        clearInterval(interval);
      }
    }, 2);

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