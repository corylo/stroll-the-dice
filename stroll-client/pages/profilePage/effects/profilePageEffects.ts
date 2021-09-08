import { useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { ProfileSettingsService } from "../../../services/profileSettingsService";
import { StepTrackerService } from "../../../services/stepTrackerService";

import { StepTrackerUtility } from "../../../utilities/stepTrackerUtility";
import { UrlUtility } from "../../../utilities/urlUtility";

import { IAppState } from "../../../components/app/models/appState";
import { IProfileEmailSettings } from "../../../../stroll-models/profileSettings";
import { IProfilePageState } from "../models/profilePageState";

import { AppAction } from "../../../enums/appAction";
import { AppStatus } from "../../../enums/appStatus";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";
import { StepTracker } from "../../../../stroll-enums/stepTracker";
import { StepTrackerConnectionStatus } from "../../../../stroll-enums/stepTrackerConnectionStatus";

import { ProfileSettingsID } from "../../../../stroll-enums/profileSettingsID";

export const useFetchEmailSettingsEffect = (
  appStatus: AppStatus,
  state: IProfilePageState,
  uid: string,
  setState: (state: IProfilePageState) => void
): void => {
  const updateSettingsStatus = (status: RequestStatus): void => {
    setState({ ...state, statuses: { ...state.statuses, loadingSettings: status} });
  }

  useEffect(() => {
    if(appStatus === AppStatus.SignedIn && uid !== "") {
      const fetch = async (): Promise<void> => {
        try {
          updateSettingsStatus(RequestStatus.Loading);

          const emailSettings: IProfileEmailSettings = await ProfileSettingsService.getByUID(uid, ProfileSettingsID.Email) as IProfileEmailSettings;

          setState({ 
            ...state, 
            settings: { ...state.settings, email: emailSettings }, 
            statuses: { ...state.statuses, loadingSettings: RequestStatus.Success } 
          });
        } catch (err) {
          console.error(err);

          updateSettingsStatus(RequestStatus.Error);
        }
      }

      fetch();
    }
  }, [appStatus, uid]);
}

export const useInitiateStepTrackerConnectionEffect = (
  appState: IAppState, 
  setToggledTo: (toggled: boolean) => void,
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
            setToggledTo(true);

            dispatch(AppAction.InitiateStepTrackerConnection, tracker);
          } else if(isError) { 
            history.replace("/profile");
              
            setToggledTo(true);

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