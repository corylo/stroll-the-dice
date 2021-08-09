import React from "react";

interface HomePagePanelProps {
  image: string;
  right?: boolean;
  text?: string;
  title: string;
}

export const HomePagePanel: React.FC<HomePagePanelProps> = (props: HomePagePanelProps) => {
  const getText = (): JSX.Element => {
    if(props.text) {
      return (
        <h1 className="home-page-panel-text passion-one-font">{props.text}</h1>
      )
    }
  }

  const getContent = (): JSX.Element => {
    return (
      <div className="home-page-panel-content">
        <h1 className="home-page-panel-title passion-one-font">{props.title}</h1>
        {getText()}
      </div>
    )
  }

  const getDesktopPanel = (): JSX.Element => {
    if(props.right === undefined || props.right === false) {
      return (
        <div className="home-page-panel desktop">
          <img src={props.image} className="home-page-panel-image" />
          {getContent()}
        </div>
      )
    }

    return(
      <div className="home-page-panel desktop">
        {getContent()}
        <img src={props.image} className="home-page-panel-image" />
      </div>
    )
  }

  const getMobilePanel = (): JSX.Element => {
    return (      
      <div className="home-page-panel mobile">
        <img src={props.image} className="home-page-panel-image" />
        {getContent()}
      </div>
    )
  }

  return (
    <div className="home-page-panel-wrapper">
      {getMobilePanel()}
      {getDesktopPanel()}
    </div>
  )
}