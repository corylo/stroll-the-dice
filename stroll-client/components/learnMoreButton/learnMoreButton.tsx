import React from "react";

import { Button } from "../buttons/button";

interface LearnMoreButtonProps {  
  
}

export const LearnMoreButton: React.FC<LearnMoreButtonProps> = (props: LearnMoreButtonProps) => {  
  return (
    <Button className="how-to-play-link" url="/how-to-play#goal">
      <i className="far fa-question" />
      <h1 className="passion-one-font">Learn more</h1>
    </Button>
  );
}