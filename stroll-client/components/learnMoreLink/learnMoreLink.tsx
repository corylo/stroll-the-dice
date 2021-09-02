import React, { useContext } from "react";

import { Button } from "../buttons/button";

import { AppContext } from "../app/contexts/appContext";

import { ImageUtility } from "../../utilities/imageUtility";

import { AppAction } from "../../enums/appAction";

interface LearnMoreLinkProps {  
  text?: string;
}

export const LearnMoreLink: React.FC<LearnMoreLinkProps> = (props: LearnMoreLinkProps) => {  
  const { dispatchToApp } = useContext(AppContext);

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const handleOnClick = (): void => dispatch(AppAction.ToggleHowToPlay, true);    

  return (
    <Button 
      className="learn-more-link" 
      styles={{ backgroundImage: `url(${ImageUtility.getGraphic("learn-more", "png")})` }}
      handleOnClick={handleOnClick}
    >
      <div className="learn-more-link-content">
        <i className="far fa-question" />
        <h1 className="passion-one-font">{props.text || "Learn more"}</h1>
      </div>
    </Button>
  );
}