import React, { useContext } from "react";
import firebase from "firebase/app";

import { auth } from "../../config/firebase";

import { Button } from "../buttons/button";
import { Modal } from "../modal/modal";
import { ModalBody } from "../modal/modalBody";
import { ModalTitle } from "../modal/modalTitle";

import { AppContext } from "../app/contexts/appContext";

import { useOnClickAwayEffect } from "../../effects/appEffects";

import { AppAction } from "../../enums/appAction";
import { StrollTheDiceCDN } from "../../../stroll-enums/strollTheDiceCDN";

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
  
    const handleSignInWithTwitter = async () => {
      const provider: firebase.auth.TwitterAuthProvider = new firebase.auth.TwitterAuthProvider();
  
      provider.setCustomParameters({ prompt: "select_account" });
  
      auth.signInWithRedirect(provider);
    }

    const privacyPolicyLink: JSX.Element = <a href="https://legal.strollthedice.com/privacy-policy" target="_blank">Privacy Policy</a>,
      termsAndConditionsLink: JSX.Element = <a href="https://legal.strollthedice.com/terms-and-conditions" target="_blank">Terms & Conditions</a>,
      cookiePolicyLink: JSX.Element = <a href="https://legal.strollthedice.com/cookie-policy" target="_blank">Cookie Policy</a>;

    return (
      <Modal id="sign-in-modal" priority>
        <ModalTitle text="Sign In" handleOnClose={() => dispatch(AppAction.ToggleSignIn, false)} />
        <ModalBody>
          <div className="sign-in-buttons">
            <Button id="google-sign-in-button" className="sign-in-button" handleOnClick={handleSignInWithGoogle}>
              <div className="sign-in-button-logo">
                <img src={`${StrollTheDiceCDN.Url}/img/brands/google-logo.png`} />
              </div>
            </Button>
            <Button id="twitter-sign-in-button" className="sign-in-button" handleOnClick={handleSignInWithTwitter}>
              <div className="sign-in-button-logo">
                <img src={`${StrollTheDiceCDN.Url}/img/brands/twitter-logo.png`} />
              </div>
            </Button>      
          </div>
          <div id="sign-in-disclaimer">
            <h1 className="passion-one-font">By signing in and continuing to use our services you are agreeing to our {privacyPolicyLink} and {termsAndConditionsLink} as well as our {cookiePolicyLink}.</h1>
          </div>
        </ModalBody>
      </Modal>
    );
  }

  return null;
}