import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { IAppState } from "../../../components/app/models/appState";

import { HowToPlayUtility } from "../../../utilities/howToPlayUtility";

import { AppAction } from "../../../enums/appAction";
import { AppStatus } from "../../../enums/appStatus";
import { HowToPlayID } from "../../../enums/howToPlayID";

export const useToggleHowToPlaySectionEffect = (appState: IAppState, dispatch: (type: AppAction, payload?: any) => void): void => {  
  const location: any = useLocation();

  useEffect(() => {
    if(appState.status !== AppStatus.Loading) { 
      
      const id: string = location.hash.split("#")[1],
        howToPlayID: HowToPlayID = HowToPlayUtility.getID(id);

      dispatch(AppAction.ToggleHowToPlay, {
        howToPlay: true,
        howToPlayID
      });      
    }
  }, [appState.status, location.hash]);
}