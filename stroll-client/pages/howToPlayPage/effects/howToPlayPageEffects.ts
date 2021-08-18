import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { IAppState } from "../../../components/app/models/appState";

import { AppStatus } from "../../../enums/appStatus";

export const useScrollHashIntoViewEffect = (appState: IAppState): void => {  
  const location: any = useLocation();

  useEffect(() => {
    if(location.hash && appState.status !== AppStatus.Loading) {   
      setTimeout(() => {
        const id: string = location.hash.split("#")[1],
          element: HTMLElement = document.getElementById(id);
          
        if(element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }
  }, [appState.status]);
}