import React, { useEffect, useState } from "react";
import classNames from "classnames";

import { Tooltip, TooltipSide } from "../tooltip/tooltip";

import { NumberUtility } from "../../../stroll-utilities/numberUtility";

enum AnimatedCounterChange {
  Decrement = "Decrement",
  Increment = "Increment",
  Neutral = ""
}

interface IAnimatedCounterState {
  change: AnimatedCounterChange;
  value: number;
}

interface AnimatedCounterProps {  
  className?: string;
  initialValue?: number;
  tooltip?: string;
  tooltipSide?: TooltipSide;
  value: number;
  formatValue?: (value: number) => string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = (props: AnimatedCounterProps) => {  
  const [state, setState] = useState<IAnimatedCounterState>({ 
    change: AnimatedCounterChange.Neutral,
    value: props.initialValue || 0
  });

  const updateValue = (value: number): void => setState({ ...state, value }),
    updateChange = (change: AnimatedCounterChange): void => setState({ ...state, change });
  
  const getIncrement = (diff: number): number => {
    if(diff >= 20000000) {
      return state.value + 10000000 + NumberUtility.random(0, 999999);
    } else if(diff >= 2000000) {
      return state.value + 1000000 + NumberUtility.random(0, 99999);
    } else if(diff >= 200000) {
      return state.value + 100000 + NumberUtility.random(0, 9999);
    } else if(diff >= 20000) {
      return state.value + 10000 + NumberUtility.random(0, 999);
    } else if (diff >= 2000) {
      return state.value + 1000 + NumberUtility.random(0, 99);
    } else if (diff >= 200) {
      return state.value + 100 + NumberUtility.random(0, 9);
    } else if (diff >= 20) {
      return state.value + 10 + NumberUtility.random(0, 9);
    } else if (diff >= 1) {
      return state.value + NumberUtility.random(0, 9);
    } else if (diff >= 0.1) {
      return state.value + (NumberUtility.random(0, 99) / 100);
    } else {
      return state.value + (NumberUtility.random(0, 99) / 100);
    }
  }
  
  const getDecrement = (diff: number): number => {
    diff = Math.abs(diff);

    if(diff >= 200000) {
      return state.value - 100000 - NumberUtility.random(0, 9999);
    } else if(diff >= 20000) {
      return state.value - 10000 - NumberUtility.random(0, 999);
    } else if (diff >= 2000) {
      return state.value - 1000 - NumberUtility.random(0, 99);
    } else if (diff >= 200) {
      return state.value - 100 - NumberUtility.random(0, 9);
    } else if (diff >= 20) {
      return state.value - 10 - NumberUtility.random(0, 9);
    } else if (diff >= 1) {
      return state.value - NumberUtility.random(0, 9);
    } else if (diff >= 0.1) {
      return state.value - (NumberUtility.random(0, 99) / 100);
    } else {
      return state.value - (NumberUtility.random(0, 99) / 100);
    }
  }

  useEffect(() => {
    const diff: number = parseFloat((props.value - state.value).toFixed(2));

    if(diff > 0) {
      updateChange(AnimatedCounterChange.Increment);
    } else if (diff < 0) {
      updateChange(AnimatedCounterChange.Decrement);
    }
  }, [props.value]);
  
  useEffect(() => {
    const diff: number = parseFloat((props.value - state.value).toFixed(2));

    if(state.change === AnimatedCounterChange.Increment) {
      const interval: NodeJS.Timeout = setInterval(() => {        
        if(diff > 0) {
          updateValue(getIncrement(diff));
        } else {
          setState({ change: AnimatedCounterChange.Neutral, value: props.value });
  
          clearInterval(interval);
        }            
      }, 10);
  
      return () => {
        clearInterval(interval);
      }
    } else if (state.change === AnimatedCounterChange.Decrement) {
      const interval: NodeJS.Timeout = setInterval(() => {
        if (diff < 0) {
          updateValue(getDecrement(diff));
        } else {
          setState({ change: AnimatedCounterChange.Neutral, value: props.value });
  
          clearInterval(interval);
        }            
      }, 10);
  
      return () => {
        clearInterval(interval);
      }
    }
    
  }, [props.value, state]);

  const getValue = (): number | string => {
    if(props.formatValue) {
      return props.formatValue(state.value);
    }

    return state.value;
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