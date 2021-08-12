import React from "react";

import { SignInLink } from "../signInLink/signInLink";

interface SignInToDoThisMessageProps {  
  image: string;
  text: string;
}

export const SignInToDoThisMessage: React.FC<SignInToDoThisMessageProps> = (props: SignInToDoThisMessageProps) => {  
  return (
    <div className="sign-in-to-do-this-message">
      <img src={props.image} className="sign-in-to-do-this-message-image" />
      <h1 className="sign-in-to-do-this-text passion-one-font">{props.text}</h1>
      <SignInLink />
    </div>
  );
}