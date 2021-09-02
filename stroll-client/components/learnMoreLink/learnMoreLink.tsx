import React from "react";

import { Button } from "../buttons/button";

interface LearnMoreLinkProps {  
  image: string;
  text: string;
  handleOnClick: () => void;
}

export const LearnMoreLink: React.FC<LearnMoreLinkProps> = (props: LearnMoreLinkProps) => {  
  return (
    <Button 
      className="learn-more-link" 
      styles={{ backgroundImage: `url(${props.image})` }}
      handleOnClick={props.handleOnClick}
    >
      <div className="learn-more-link-content">
        <i className="far fa-question" />
        <h1 className="passion-one-font">{props.text}</h1>
      </div>
    </Button>
  );
}