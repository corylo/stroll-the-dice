import { IAction } from "../../../models/action";
import { IAppState } from "../models/appState";
import { defaultAppToggles } from "../models/appToggles";

import { AppAction } from "../../../enums/appAction";
import { AppStatus } from "../../../enums/appStatus";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";
import { StepTracker } from "../../../../stroll-enums/stepTracker";

export const appReducer = (state: IAppState, action: IAction): IAppState => {  
  switch (action.type) {    
    case AppAction.CloseModals:
      return {
        ...state,
        toggles: defaultAppToggles()
      }
    case AppAction.CompleteStepTrackerConnection:
      return {
        ...state,              
        statuses: {
          ...state.statuses,
          tracker: {
            ...state.statuses.tracker,
            is: RequestStatus.Success
          }
        }
      }   
    case AppAction.CompleteStepTrackerDisconnection:
      return {
        ...state,              
        statuses: {
          ...state.statuses,
          tracker: {
            ...state.statuses.tracker,
            is: RequestStatus.Idle
          }
        },
        user: {
          ...state.user,
          profile: {
            ...state.user.profile,
            tracker: StepTracker.Unknown
          }
        }
      } 
    case AppAction.FailedStepTrackerConnection:
      return {
        ...state,              
        statuses: {
          ...state.statuses,
          tracker: {
            ...state.statuses.tracker,
            is: RequestStatus.Error
          }
        }
      }
    case AppAction.InitiateSignOut:
      return {
        ...state,        
        status: AppStatus.Loading,
        toggles: {
          ...state.toggles,
          menu: false
        }
      }
    case AppAction.InitiateStepTrackerConnection:
      return {
        ...state,              
        statuses: {
          ...state.statuses,
          tracker: {
            ...state.statuses.tracker,
            is: RequestStatus.Loading
          }
        },
        toggles: {
          ...state.toggles,
          profile: true
        },
        user: {
          ...state.user,
          profile: {
            ...state.user.profile,
            tracker: action.payload
          }
        }
      }
    case AppAction.InitiateStepTrackerDisconnection:
      return {
        ...state,              
        statuses: {
          ...state.statuses,
          tracker: {
            ...state.statuses.tracker,
            is: RequestStatus.Loading
          }
        }
      }
    case AppAction.SetProfile:
      return {
        ...state,
        user: {
          ...state.user,
          profile: action.payload
        }
      }
    case AppAction.SetProfileAndClose:
      return {
        ...state,
        toggles: {
          ...state.toggles,
          profile: false
        },
        user: {
          ...state.user,
          profile: action.payload
        }
      }
    case AppAction.SetStatus:
      return {
        ...state,
        status: action.payload
      }
    case AppAction.SignInUser:
      return {
        ...state,
        status: AppStatus.SignedIn,
        user: action.payload
      }
    case AppAction.SignInUserForFirstTime:
      return {
        ...state,
        status: AppStatus.SignedIn,
        user: action.payload,
        toggles: {
          ...state.toggles,
          profile: true
        }
      }
    
    case AppAction.ToggleAcceptInvite:
      return {
        ...state,
        toggles: {
          ...state.toggles,
          acceptInvite: action.payload
        }
      }
    case AppAction.ToggleUpdateProfile:
      return {
        ...state,
        toggles: {
          ...state.toggles,
          profile: action.payload
        }
      }
    case AppAction.ToggleMenu:
      return {
        ...state,
        toggles: {
          ...state.toggles,
          menu: action.payload
        }
      }
    case AppAction.ToggleSignIn:
      return {
        ...state,
        toggles: {
          ...state.toggles,
          signIn: action.payload
        }
      }
    default:
      throw new Error(`Unknown action type in appReducer: ${action.type}`);
  }
}