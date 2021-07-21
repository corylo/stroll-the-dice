import React from "react";

interface HowToPlaySubSectionProps {
  children: any;
  title?: string;
}

export const HowToPlaySubSection: React.FC<HowToPlaySubSectionProps> = (props: HowToPlaySubSectionProps) => {  
  const getTitle = (): JSX.Element => {
    if(props.title) {
      return (        
        <h1 className="how-to-play-sub-section-title passion-one-font">{props.title}</h1>
      )
    }
  }

  return(
    <div className="how-to-play-sub-section">     
      {getTitle()}
      <div className="how-to-play-sub-section-content">
        {props.children}
      </div>
    </div>
  )
}