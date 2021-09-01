import React from "react";

import { Button } from "../buttons/button";

import { ImageUtility } from "../../utilities/imageUtility";

interface LearnMoreLinkProps {  
  text?: string;
}

export const LearnMoreLink: React.FC<LearnMoreLinkProps> = (props: LearnMoreLinkProps) => {  
  return (
    <Button className="learn-more-link" url="/how-to-play#goal" styles={{ backgroundImage: `url(${ImageUtility.getGraphic("learn-more", "png")})` }}>
      <div className="learn-more-link-content text-border">
        <i className="far fa-question" />
        <h1 className="passion-one-font">{props.text || "Learn more"}</h1>
      </div>
    </Button>
  );
}