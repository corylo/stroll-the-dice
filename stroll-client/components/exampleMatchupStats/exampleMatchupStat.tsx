import React, { useEffect, useState } from "react";

import { AnimatedCounter } from "../animatedCounter/animatedCounter";

import { Icon } from "../../../stroll-enums/icon";
import { NumberUtility } from "../../../stroll-utilities/numberUtility";

interface ExampleMatchupStatProps {  
  description: string;
  icon: Icon;
  interval?: number;
  index: number;
  title: string;
  value: number;
  formatValue?: (value: number) => string;
}

export const ExampleMatchupStat: React.FC<ExampleMatchupStatProps> = (props: ExampleMatchupStatProps) => {  
  const [value, setValue] = useState<number>(props.value);

  useEffect(() => {
    if(props.interval) {
      const interval: NodeJS.Timeout = setInterval(() => {
        const delta: number = props.value * 0.2;

        const min: number = props.value - delta,
          max: number = props.value + delta;

        setValue(NumberUtility.random(min, max));
      }, props.interval)

      return () => {
        clearInterval(interval);
      }
    }
  }, [props.interval]);

  const getStat = (): JSX.Element => {
    return (
      <div className="example-matchup-stat">
        <h1 className="example-matchup-stat-value passion-one-font">
          <i className={props.icon} />
          <AnimatedCounter 
            initialValue={props.value} 
            value={value} 
            formatValue={props.formatValue} 
          />
        </h1>
      </div>
    )
  }

  const getStatDescription = (): JSX.Element => {
    return (
      <div className="example-matchup-stat-details">
        <h1 className="example-matchup-stat-title passion-one-font">{props.title}</h1>
        <h1 className="example-matchup-stat-description passion-one-font">{props.description}</h1>
      </div>
    )
  }

  const getContent = (): JSX.Element => {
    if(props.index % 2 !== 0) {
      return (
        <React.Fragment>
          {getStat()}
          {getStatDescription()}
        </React.Fragment>
      )
    }
    
    return (
      <React.Fragment>
        {getStatDescription()}
        {getStat()}
      </React.Fragment>
    )
  }

  return (    
    <div className="example-matchup-stat-wrapper">
      <div className="example-matchup-stat-content">
        {getContent()}
      </div>
    </div>
  )
}