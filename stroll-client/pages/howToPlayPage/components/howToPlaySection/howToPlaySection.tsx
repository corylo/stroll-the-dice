import React from "react";

interface HowToPlaySectionProps {
  children?: any;
  title?: string;
}

export const HowToPlaySection: React.FC<HowToPlaySectionProps> = (props: HowToPlaySectionProps) => {  
  const getTitle = (): JSX.Element => {
    if(props.title) {
      return (        
        <h1 className="how-to-play-section-title passion-one-font">{props.title}</h1>
      )
    }
  }

  const getContent = (): JSX.Element => {
    if(props.children) {
      return (
        <div className="how-to-play-section-content-wrapper">     
          <div className="how-to-play-section-content-border" />     
          <div className="how-to-play-section-content">
            {props.children}
          </div>        
        </div>
      )
    }
  }
  return(
    <div className="how-to-play-section">     
      {getTitle()}
      {getContent()}
    </div>
  )
}