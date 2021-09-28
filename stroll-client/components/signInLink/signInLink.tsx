import React, { useContext } from "react";

import { Button } from "../buttons/button";

import { AppContext } from "../app/contexts/appContext";

import { AppAction } from "../../enums/appAction";

interface SignInLinkProps {  
  label?: string;
}

export const SignInLink: React.FC<SignInLinkProps> = (props: SignInLinkProps) => {  
  const { dispatchToApp } = useContext(AppContext);

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  return (
    <Button className="sign-in-link" handleOnClick={() => dispatch(AppAction.ToggleSignIn, true)}>
      <i className="fad fa-sign-in" />
      <h1 className="passion-one-font">{props.label || "Sign in"}</h1>
    </Button>
  );
}