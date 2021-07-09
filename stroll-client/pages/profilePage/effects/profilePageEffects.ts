import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { StepTrackerService } from "../../../services/stepTrackerService";

import { StepTrackerUtility } from "../../../utilities/stepTrackerUtility";
import { UrlUtility } from "../../../utilities/urlUtility";

import { IAppState } from "../../../components/app/models/appState";
import { defaultStepTracker, IStepTracker } from "../../../../stroll-models/stepTracker";

import { AppAction } from "../../../enums/appAction";
import { AppStatus } from "../../../enums/appStatus";
import { StepTracker } from "../../../../stroll-enums/stepTracker";

interface IUseConnectStepTrackerEffectState {
  authorizationCode: string;
  tracker: IStepTracker;
}

const defaultUseConnectStepTrackerEffectState = (): IUseConnectStepTrackerEffectState => ({
  authorizationCode: "",
  tracker: defaultStepTracker()
})

export const useConnectStepTrackerEffect = (
  appState: IAppState, 
  dispatch: (type: AppAction, payload?: any) => void
): void => {  
  const match: any = useRouteMatch(),
    history: any = useHistory();

  const [state, setState] = useState<IUseConnectStepTrackerEffectState>({
    authorizationCode: UrlUtility.getQueryParam("code"),
    tracker: {
      ...defaultStepTracker(),      
      name:  StepTrackerUtility.determineTrackerFromParam(match)
    }
  });

  useEffect(() => {
    const load = async (): Promise<void> => {
      if(
        appState.status === AppStatus.SignedIn && 
        !appState.user.profile.tracker &&
        state.authorizationCode !== "" &&
        state.tracker.name !== StepTracker.Unknown
      ) {
        dispatch(AppAction.InitiateStepTrackerConnection, state.tracker.name);

        try {  
          await StepTrackerService.connect(
            state.authorizationCode, 
            appState.user.profile.uid, 
            state.tracker
          );

          setState(defaultUseConnectStepTrackerEffectState());

          dispatch(AppAction.CompleteStepTrackerConnection);
        } catch (err) {
          console.error(err);

          dispatch(AppAction.FailedStepTrackerConnection);
        }
      }

      history.replace("/profile");
    }

    load();
  }, [appState.status, state]);
}