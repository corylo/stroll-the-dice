import React from "react";

import { SignInLink } from "../signInLink/signInLink";

interface SignInToDoThisMessageProps {  
  image: string;
  index: number;
  text: string;
}

export const SignInToDoThisMessage: React.FC<SignInToDoThisMessageProps> = (props: SignInToDoThisMessageProps) => {  
  return (
    <div className="sign-in-to-do-this-message">
      <div className="sign-in-to-do-this-message-image-wrapper">
        <div className="sign-in-to-do-this-message-image" style={{ backgroundImage: `url(${props.image})` }} />
      </div>
      <h1 className="sign-in-to-do-this-text passion-one-font">{props.text}</h1>
      <SignInLink />
    </div>
  );
}