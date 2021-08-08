import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Page } from "../../components/page/page";

import { AppContext } from "../../components/app/contexts/appContext";

import { AppStatus } from "../../enums/appStatus";

interface GoodbyePageProps {
  
}

export const GoodbyePage: React.FC<GoodbyePageProps> = (props: GoodbyePageProps) => {
  const { appState } = useContext(AppContext);

  const history: any = useHistory();

  useEffect(() => {
    if(appState.status === AppStatus.SignedIn) {
      history.replace("/");
    }
  }, [appState.status]);

  return(
    <Page 
      id="goodbye-page" 
      backgroundGraphic=""
    >     
      <h1 className="goodbye-title passion-one-font">Goodbye!</h1>
      <h1 className="goodbye-subtitle passion-one-font">Your account data has been successfully deleted!</h1>
      <h1 className="goodbye-text passion-one-font">It was nice having you here, come back any time 🙂.</h1>
    </Page>
  )
}