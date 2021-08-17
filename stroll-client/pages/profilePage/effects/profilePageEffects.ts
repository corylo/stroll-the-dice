import { useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { StepTrackerService } from "../../../services/stepTrackerService";

import { StepTrackerUtility } from "../../../utilities/stepTrackerUtility";
import { UrlUtility } from "../../../utilities/urlUtility";

import { IAppState } from "../../../components/app/models/appState";

import { AppAction } from "../../../enums/appAction";
import { AppStatus } from "../../../enums/appStatus";
import { StepTracker } from "../../../../stroll-enums/stepTracker";
import { StepTrackerConnectionStatus } from "../../../../stroll-enums/stepTrackerConnectionStatus";

export const useInitiateStepTrackerConnectionEffect = (
  appState: IAppState, 
  setToggled: (toggled: boolean) => void,
  dispatch: (type: AppAction, payload?: any) => void
): void => {  
  const match: any = useRouteMatch(),
    history: any = useHistory();

  useEffect(() => {
    const load = async (): Promise<void> => {
      if(appState.status === AppStatus.SignedIn) {
        try {
          const authorizationCode: string = UrlUtility.getQueryParam("code"),
            tracker: string = StepTrackerUtility.determineTrackerFromParam(match),
            isError: boolean = UrlUtility.getQueryParam("error") === "access_denied";

          if(
            appState.user.profile.tracker.name === StepTracker.Unknown &&
            authorizationCode &&
            tracker
          ) {
            setToggled(true);

            dispatch(AppAction.InitiateStepTrackerConnection, tracker);
          } else if(isError) { 
            history.replace("/profile");
              
            setToggled(true);

            dispatch(AppAction.FailedStepTrackerConnection, tracker);
          }
        } catch (err) {
          history.replace("/profile");

          dispatch(AppAction.ResetStepTrackerConnection);
        }
      }
    }

    load();
  }, [appState.status]);
}

export const useConnectStepTrackerEffect = (
  appState: IAppState, 
  dispatch: (type: AppAction, payload?: any) => void
): void => {  
  const match: any = useRouteMatch(),
    history: any = useHistory();

  const { user } = appState;

  useEffect(() => {
    const load = async (): Promise<void> => {
      const authorizationCode: string = UrlUtility.getQueryParam("code"),
        tracker: StepTracker = StepTrackerUtility.determineTrackerFromParam(match);
      
      if(user.profile.tracker.status === StepTrackerConnectionStatus.Initiated) {
        try {
          dispatch(AppAction.SetStepTrackerConnectionStatus, StepTrackerConnectionStatus.Connecting);

          history.replace("/profile");

          await StepTrackerService.connect(
            authorizationCode, 
            user.profile.uid, { 
              accessToken: "",
              name: tracker, 
              refreshToken: "" 
            }
          );
          
          dispatch(AppAction.SetStepTrackerConnectionStatus, StepTrackerConnectionStatus.Connected);
        } catch (err) {
          console.error(err);

          dispatch(AppAction.SetStepTrackerConnectionStatus, StepTrackerConnectionStatus.ConnectionFailed);
        }
      } else if (user.profile.tracker.status === StepTrackerConnectionStatus.Connected) {        
        try {
          dispatch(AppAction.SetStepTrackerConnectionStatus, StepTrackerConnectionStatus.Verifying);

          history.replace("/profile");

          await StepTrackerService.verify();
          
          dispatch(AppAction.SetStepTrackerConnectionStatus, StepTrackerConnectionStatus.Verified);
        } catch (err) {
          console.error(err);

          dispatch(AppAction.SetStepTrackerConnectionStatus, StepTrackerConnectionStatus.VerificationFailed);
        }
      }
    }

    load();
  }, [user.profile.tracker.status]);
}

export const useToggleUpdateProfileEffect = (
  appState: IAppState, 
  dispatch: (type: AppAction, payload?: any) => void
): void => {  
  const history: any = useHistory();

  useEffect(() => {
    if(appState.status === AppStatus.SignedIn) {
      const update: string = UrlUtility.getQueryParam("update");

      if(update) {
        dispatch(AppAction.ToggleUpdateProfile, true);

        history.replace("/profile");
      }
    }
  }, [appState.status]);
}