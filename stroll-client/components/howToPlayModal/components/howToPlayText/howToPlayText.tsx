import React from "react";

interface HowToPlayTextProps {  
  children?: any;
  text: string | string[];
}

export const HowToPlayText: React.FC<HowToPlayTextProps> = (props: HowToPlayTextProps) => {  
  const getChildren = (): JSX.Element => {
    if(props.children) {
      return props.children;
    }
  }

  const getText = (): JSX.Element | JSX.Element[] => {
    if(Array.isArray(props.text)) {
      return props.text.map((line: string, index: number) => (
        <p key={index} className="passion-one-font">{line}</p>
      ));
    }

    return (
      <p className="passion-one-font">{props.text}</p>
    )
  }

  return(
    <div className="how-to-play-text">
      {getText()}
      {getChildren()}
    </div>
  )
}