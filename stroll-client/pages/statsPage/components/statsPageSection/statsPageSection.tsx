import React from "react";
import classNames from "classnames";

interface StatsPageSectionProps { 
  children: any;
  className: string;
  title?: string;
}

export const StatsPageSection: React.FC<StatsPageSectionProps> = (props: StatsPageSectionProps) => {    
  const getTitle = (): JSX.Element => {
    if(props.title) {
      return (
        <div className="stats-page-section-title">
          <h1 className="stats-page-section-title-text passion-one-font">{props.title}</h1>     
        </div>
      )
    }
  }
  return (
    <div className={classNames("stats-page-section", props.className)}>      
      {getTitle()}
      <div className="stats-page-section-content">
        {props.children}
      </div>
    </div>
  );
}