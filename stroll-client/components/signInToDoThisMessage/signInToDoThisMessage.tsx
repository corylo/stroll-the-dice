import React from "react";

import { SignInLink } from "../signInLink/signInLink";
import { SvgBlob } from "../svgBlob/svgBlob";

interface SignInToDoThisMessageProps {  
  image: string;
  index: number;
  text: string;
}

export const SignInToDoThisMessage: React.FC<SignInToDoThisMessageProps> = (props: SignInToDoThisMessageProps) => {  
  return (
    <div className="sign-in-to-do-this-message">
      <div className="sign-in-to-do-this-message-image">
        <SvgBlob index={props.index} />
        <img src={props.image} />
      </div>
      <h1 className="sign-in-to-do-this-text passion-one-font">{props.text}</h1>
      <SignInLink />
    </div>
  );
}