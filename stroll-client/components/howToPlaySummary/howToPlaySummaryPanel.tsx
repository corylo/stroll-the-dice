import React from "react";

import { SvgBlob } from "../svgBlob/svgBlob";

interface HowToPlaySummaryPanelProps {
  image: string;
  index: number;
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

  const getImage = (): JSX.Element => {
    return (
      <div className="how-to-play-summary-panel-image">
        <img src={props.image} />
      </div>
    )
  }

  const getDesktopPanel = (): JSX.Element => {
    if(props.right === undefined || props.right === false) {
      return (
        <div className="how-to-play-summary-panel desktop left">
          {getImage()}
          {getContent()}
        </div>
      )
    }

    return(
      <div className="how-to-play-summary-panel desktop right">
        {getContent()}
        {getImage()}
      </div>
    )
  }

  const getMobilePanel = (): JSX.Element => {
    return (      
      <div className="how-to-play-summary-panel mobile">
        {getImage()}
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