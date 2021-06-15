import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";

import { LoadingIcon } from "../../components/loadingIcon/loadingIcon";
import { PageBackgroundGraphic } from "./pageBackgroundGraphic";
import { PageMessage } from "./pageMessage";

import { AppContext } from "../../components/app/contexts/appContext";

import { AppStatus } from "../../enums/appStatus";
import { RequestStatus } from "../../../stroll-enums/requestStatus";

interface PageProps {
  backgroundGraphic?: string;
  children: JSX.Element | JSX.Element[];
  errorMessage?: string;
  id?: string;
  requireAuth?: boolean;
  status?: RequestStatus;
}

export const Page: React.FC<PageProps> = (props: PageProps) => {
  const { appState } = useContext(AppContext);

  const history: any = useHistory();

  useEffect(() => {
    if(props.requireAuth && appState.status === AppStatus.SignedOut) {
      history.replace("/");
    }
  }, [appState.status]);
  
  const getPageMessage = (): JSX.Element => {
    if(props.status === RequestStatus.Error) {
      const message: string = props.errorMessage || "Whoops! We ran into an issue loading the page. Please refresh and try again.";

      return (
        <PageMessage>
          <h1 className="passion-one-font">{message}</h1>
        </PageMessage>        
      )
    }
  }

  const getPageContent = (): JSX.Element | JSX.Element[] => {
    if(
      appState.status === AppStatus.Loading ||
      props.status === RequestStatus.Loading
    ) { 
      return (
        <div className="page-loading-icon">
          <LoadingIcon />
        </div>
      );
    } else if(props.status === RequestStatus.Error) {
      return getPageMessage();
    }
    
    return props.children;
  }

  const getPageBackgroundGraphic = (): JSX.Element => {
    if(props.backgroundGraphic && props.status !== RequestStatus.Loading) {
      return (
        <PageBackgroundGraphic img={props.backgroundGraphic} />
      )
    }
  }

  return (
    <div id={props.id} className="page">
      <div className="page-content-wrapper">
        <div className="page-content">
          {getPageContent()}
        </div>
      </div>
      {getPageBackgroundGraphic()}
    </div>
  )
}