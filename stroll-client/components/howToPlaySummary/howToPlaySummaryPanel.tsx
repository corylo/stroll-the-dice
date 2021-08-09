import React from "react";

interface HowToPlaySummaryPanelProps {
  image: string;
  right?: boolean;
  text?: string;
  title: string;
}

export const HowToPlaySummaryPanel: React.FC<HowToPlaySummaryPanelProps> = (props: HowToPlaySummaryPanelProps) => {
  const getText = (): JSX.Element => {
    if(props.text) {
      return (
        <h1 className="how-to-play-summary-panel-text passion-one-font">{props.text}</h1>
      )
    }
  }

  const getContent = (): JSX.Element => {
    return (
      <div className="how-to-play-summary-panel-content">
        <h1 className="how-to-play-summary-panel-title passion-one-font">{props.title}</h1>
        {getText()}
      </div>
    )
  }

  const getDesktopPanel = (): JSX.Element => {
    if(props.right === undefined || props.right === false) {
      return (
        <div className="how-to-play-summary-panel desktop">
          <img src={props.image} className="how-to-play-summary-panel-image" />
          {getContent()}
        </div>
      )
    }

    return(
      <div className="how-to-play-summary-panel desktop">
        {getContent()}
        <img src={props.image} className="how-to-play-summary-panel-image" />
      </div>
    )
  }

  const getMobilePanel = (): JSX.Element => {
    return (      
      <div className="how-to-play-summary-panel mobile">
        <img src={props.image} className="how-to-play-summary-panel-image" />
        {getContent()}
      </div>
    )
  }

  return (
    <div className="how-to-play-summary-panel-wrapper">
      {getMobilePanel()}
      {getDesktopPanel()}
    </div>
  )
}