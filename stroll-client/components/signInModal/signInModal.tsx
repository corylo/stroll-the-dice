import React, { useContext } from "react";
import firebase from "firebase/app";

import { auth } from "../../firebase";

import { Button } from "../buttons/button";
import { Modal } from "../modal/modal";
import { ModalBody } from "../modal/modalBody";
import { ModalTitle } from "../modal/modalTitle";

import { AppContext } from "../app/contexts/appContext";

import { useOnClickAwayEffect } from "../../effects/appEffects";

import { AppAction } from "../../enums/appAction";

interface SignInModalProps {  
  
}

export const SignInModal: React.FC<SignInModalProps> = (props: SignInModalProps) => {  
  const { appState, dispatchToApp } = useContext(AppContext);

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const { toggles } = appState;
  
  useOnClickAwayEffect(
    toggles.signIn, 
    ["sign-in-modal-content"], 
    [toggles.signIn], 
    () => dispatch(AppAction.ToggleSignIn, false)
  );

  if(toggles.signIn) {
    const handleSignInWithGoogle = async () => {
      const provider: firebase.auth.GoogleAuthProvider = new firebase.auth.GoogleAuthProvider();
  
      provider.setCustomParameters({ prompt: "select_account" });
  
      auth.signInWithRedirect(provider);
    }
  
    const handleSignInWithFacebook = async () => {
      const provider: firebase.auth.GoogleAuthProvider = new firebase.auth.FacebookAuthProvider();
  
      auth.signInWithRedirect(provider);
    }

    // const handleSignInWithTwitter = async () => {
    //   const provider: firebase.auth.TwitterAuthProvider = new firebase.auth.TwitterAuthProvider();
  
    //   provider.setCustomParameters({ prompt: "select_account" });
  
    //   auth.signInWithRedirect(provider);
    // }

    return (
      <Modal id="sign-in-modal" priority>
        <ModalTitle text="Sign In" handleOnClose={() => dispatch(AppAction.ToggleSignIn, false)} />
        <ModalBody>
          <Button id="google-sign-in-button" className="sign-in-button" handleOnClick={handleSignInWithGoogle}>
            <img src="/img/brands/google-logo.png" />
            <h1 className="passion-one-font">Sign In</h1>
          </Button>
          <Button id="facebook-sign-in-button" className="sign-in-button" handleOnClick={handleSignInWithFacebook}>
            <img src="/img/brands/facebook-logo.png" />
            <h1 className="passion-one-font">Sign In</h1>
          </Button>
          {/* <Button id="twitter-sign-in-button" className="sign-in-button" handleOnClick={handleSignInWithTwitter}>
            <img src="/img/brands/twitter-logo.png" />
            <h1 className="passion-one-font">Sign In</h1>
          </Button> */}
          {/* <div id="sign-in-disclaimer">
            <h1 className="passion-one-font">By signing in you agree to our <a href="https://legal.strollthedice.com/privacy">Privacy Policy</a> and <a href="https://legal.strollthedice.com/terms">Terms & Conditions</a></h1>
          </div> */}
        </ModalBody>
      </Modal>
    );
  }

  return null;
}