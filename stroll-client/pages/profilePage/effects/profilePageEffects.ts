import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { StepTrackerService } from "../../../services/stepTrackerService";

import { StepTrackerUtility } from "../../../utilities/stepTrackerUtility";
import { UrlUtility } from "../../../utilities/urlUtility";

import { IAppState } from "../../../components/app/models/appState";
import { IStepTracker } from "../../../../stroll-models/stepTracker";

import { AppAction } from "../../../enums/appAction";
import { AppStatus } from "../../../enums/appStatus";
import { StepTracker } from "../../../../stroll-enums/stepTracker";

export const useConnectStepTrackerEffect = (
  appState: IAppState, 
  dispatch: (type: AppAction, payload?: any) => void
): void => {  
  const match: any = useRouteMatch(),
    history: any = useHistory();

  const [tracker] = useState<IStepTracker>({
    authorizationCode: UrlUtility.getQueryParam("code"),
    name:  StepTrackerUtility.determineTrackerFromParam(match)
  });

  useEffect(() => {
    const load = async (): Promise<void> => {
      if(
        appState.status === AppStatus.SignedIn && 
        appState.tracker === null &&
        tracker.authorizationCode !== "" &&
        tracker.name !== StepTracker.Unknown
      ) {
        dispatch(AppAction.InitiateStepTrackerConnection, tracker.name);

        try {          
          await StepTrackerService.create(appState.user.profile.uid, tracker);

          dispatch(AppAction.CompleteStepTrackerConnection, tracker);
        } catch (err) {
          console.error(err);
        }
      }

      history.replace("/profile");
    }

    load();
  }, [appState.status]);
}