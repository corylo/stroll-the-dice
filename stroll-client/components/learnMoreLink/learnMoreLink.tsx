import React from "react";

import { Button } from "../buttons/button";

import { AnalyticsUtility } from "../../utilities/analyticsUtility";

interface LearnMoreLinkProps {  
  image: string;
  text: string;
  handleOnClick: () => void;
}

export const LearnMoreLink: React.FC<LearnMoreLinkProps> = (props: LearnMoreLinkProps) => {  
  const handleOnClick = (): void => {
    props.handleOnClick();

    AnalyticsUtility.log("learn_more_link_click", { text: props.text });    
  }

  return (
    <Button 
      className="learn-more-link" 
      styles={{ backgroundImage: `url(${props.image})` }}
      handleOnClick={handleOnClick}
    >
      <div className="learn-more-link-content">
        <i className="far fa-question" />
        <h1 className="passion-one-font">{props.text}</h1>
      </div>
    </Button>
  );
}