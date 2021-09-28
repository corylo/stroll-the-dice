import React from "react";
import classNames from "classnames";

interface HowToPlaySummaryPanelProps {
  backgroundImage?: string;
  className?: string;
  children?: JSX.Element | JSX.Element[];
  text: string;
  title: string;
}

export const HowToPlaySummaryPanel: React.FC<HowToPlaySummaryPanelProps> = (props: HowToPlaySummaryPanelProps) => {  
  const getImage = (): JSX.Element | JSX.Element[] => {
    if(props.children) {
      return props.children;
    }

    return (
      <div className="how-to-play-summary-panel-image" style={{ backgroundImage: `url(${props.backgroundImage})` }} />        
    )
  }
  return (
    <div className={classNames("how-to-play-summary-panel-wrapper", props.className)}>
      <div className="how-to-play-summary-panel-content">
        <h1 className="how-to-play-summary-panel-title passion-one-font">{props.title}</h1>        
        <h1 className="how-to-play-summary-panel-text passion-one-font">{props.text}</h1>
      </div>
      <div className="how-to-play-summary-panel-image-wrapper">
        {getImage()}
      </div>
    </div>
  )
}