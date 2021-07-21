import React from "react";

interface HowToPlaySectionTextProps {  
  text: string;
}

export const HowToPlaySectionText: React.FC<HowToPlaySectionTextProps> = (props: HowToPlaySectionTextProps) => {  
  return(
    <div className="how-to-play-section-text">
      <div className="how-to-play-section-text-border" />
      <div className="how-to-play-section-text-content">
        <p className="passion-one-font">{props.text}</p>
      </div>
    </div>
  )
}