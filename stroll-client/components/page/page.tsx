import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";

import { LoadingIcon } from "../../components/loadingIcon/loadingIcon";
import { PageBackgroundGraphic } from "./pageBackgroundGraphic";
import { PageMessage } from "./pageMessage";

import { AppContext } from "../../components/app/contexts/appContext";

import { ImageUtility } from "../../utilities/imageUtility";

import { AppStatus } from "../../enums/appStatus";
import { Graphic } from "../../../stroll-enums/graphic";
import { RequestStatus } from "../../../stroll-enums/requestStatus";

interface PageProps {
  backgroundGraphic?: string;
  children: JSX.Element | JSX.Element[];
  errorMessage?: string;
  id?: string;
  requireAuth?: boolean;
  showFooter?: boolean;
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
    if(props.backgroundGraphic !== undefined && props.status !== RequestStatus.Loading) {
      return (
        <PageBackgroundGraphic img={props.backgroundGraphic || ImageUtility.getGraphic(Graphic.Running, "png")} />
      )
    }
  }

  const getFooter = (): JSX.Element => {
    if(
      props.showFooter && 
      appState.status === AppStatus.SignedOut
    ) {
      return (
        <div className="page-content-footer">
          <div className="page-content-footer-legal-policies">
            <h1 className="passion-one-font">Legal</h1>
            <div className="page-content-footer-legal-policies-list">
              <a className="passion-one-font" href="https://legal.strollthedice.com/privacy-policy" target="_blank">Privacy Policy</a>
              <a className="passion-one-font" href="https://legal.strollthedice.com/terms-and-conditions" target="_blank">Terms & Conditions</a>
              <a className="passion-one-font" href="https://legal.strollthedice.com/cookie-policy" target="_blank">Cookie Policy</a>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div id={props.id} className="page">
      <div className="page-content-wrapper">
        <div className="page-content">
          {getPageContent()}
          {getFooter()}
        </div>
      </div>
      {getPageBackgroundGraphic()}
    </div>
  )
}