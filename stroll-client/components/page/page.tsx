import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";

import { LoadingIcon } from "../../components/loadingIcon/loadingIcon";
import { PageBackgroundGraphic } from "./pageBackgroundGraphic";
import { PageMessage } from "./pageMessage";
import { PageMessageAction } from "./pageMessageAction";

import { AppContext } from "../../components/app/contexts/appContext";

import { AppStatus } from "../../enums/appStatus";
import { RequestStatus } from "../../../stroll-enums/requestStatus";

interface PageProps {
  backgroundGraphic?: string;
  backToHome?: boolean;
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
  
  const getPageContent = (): JSX.Element => {
    if(
      appState.status !== AppStatus.Loading &&
      props.status !== RequestStatus.Loading &&
      props.status !== RequestStatus.Error
    ) {      
      return (
        <div className="page-content">
          {props.children}
        </div>
      )
    }
  }

  const getLoading = (): JSX.Element => {
    if(appState.status === AppStatus.Loading || props.status === RequestStatus.Loading) {
      return (
        <LoadingIcon />
      )
    }
  }

  const getPageBackgroundGraphic = (): JSX.Element => {
    if(props.backgroundGraphic && props.status !== RequestStatus.Loading) {
      return (
        <PageBackgroundGraphic img={props.backgroundGraphic} />
      )
    }
  }

  const getPageMessage = (): JSX.Element => {
    if(props.status === RequestStatus.Error) {
      const message: string = props.errorMessage || "Whoops! We ran into an issue loading the page. Please refresh and try again.";

      const getBackToHome = (): JSX.Element => {
        if(props.backToHome) {
          return (            
            <PageMessageAction handleOnClick={() => history.push("/")}>
              Back to Home
            </PageMessageAction>
          )
        }
      }

      return (
        <PageMessage>
          <h1 className="passion-one-font">{message}</h1>
          {getBackToHome()}
        </PageMessage>        
      )
    }
  }

  return (
    <div id={props.id} className="page">
      {getPageContent()}
      {getLoading()}
      {getPageBackgroundGraphic()}
      {getPageMessage()}
    </div>
  )
}