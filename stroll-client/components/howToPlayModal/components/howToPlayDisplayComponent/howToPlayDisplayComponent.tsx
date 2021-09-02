import React from "react";
import classNames from "classnames";

interface HowToPlayDisplayComponentProps {  
  children: any;
  className?: string;
}

export const HowToPlayDisplayComponent: React.FC<HowToPlayDisplayComponentProps> = (props: HowToPlayDisplayComponentProps) => {  
  return(
    <div className={classNames("how-to-play-display-component", props.className)}>
      {props.children}
    </div>
  )
}