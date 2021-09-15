import React from "react";
import classNames from "classnames";

interface StatsSectionProps { 
  children: any;
  className: string;
  title?: string;
}

export const StatsSection: React.FC<StatsSectionProps> = (props: StatsSectionProps) => {    
  const getTitle = (): JSX.Element => {
    if(props.title) {
      return (
        <div className="stats-section-title">
          <h1 className="stats-section-title-text passion-one-font">{props.title}</h1>     
        </div>
      )
    }
  }
  return (
    <div className={classNames("stats-section", props.className)}>      
      {getTitle()}
      <div className="stats-section-content">
        {props.children}
      </div>
    </div>
  );
}