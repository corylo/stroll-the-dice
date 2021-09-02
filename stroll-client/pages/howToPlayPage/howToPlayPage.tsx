import React, { useContext } from "react";
import { Redirect } from "react-router-dom";

import { Page } from "../../components/page/page";

import { AppContext } from "../../components/app/contexts/appContext";

import { useToggleHowToPlaySectionEffect } from "./effects/howToPlayPageEffects";

import { AppAction } from "../../enums/appAction";
import { RequestStatus } from "../../../stroll-enums/requestStatus";

interface HowToPlayPageProps {
  
}

export const HowToPlayPage: React.FC<HowToPlayPageProps> = (props: HowToPlayPageProps) => { 
  const { appState, dispatchToApp } = useContext(AppContext);

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  useToggleHowToPlaySectionEffect(appState, dispatch);

  if(appState.toggles.howToPlay) {
    return(
      <Redirect to="/" />
    )
  }

  return (
    <Page status={RequestStatus.Loading}>
      <div/>
    </Page>
  );
}