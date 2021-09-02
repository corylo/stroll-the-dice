import React from "react";

interface HowToPlayTextSubnoteProps {    
  text: string;
}

export const HowToPlayTextSubnote: React.FC<HowToPlayTextSubnoteProps> = (props: HowToPlayTextSubnoteProps) => {    
  return(
    <div className="how-to-play-text-subnote">
      <i className="fal fa-info-circle" />
      <p className="passion-one-font">{props.text}</p>
    </div>
  )
}