import { IAction } from "../../../models/action";
import { IAppState } from "../models/appState";

import { AppAction } from "../../../enums/appAction";
import { AppStatus } from "../../../enums/appStatus";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export const appReducer = (state: IAppState, action: IAction): IAppState => {  
  switch (action.type) {    
    case AppAction.CompleteStepTrackerConnection:
      return {
        ...state,      
        statuses: {
          ...state.statuses,
          tracker: {
            ...state.statuses.tracker,
            is: RequestStatus.Success
          }
        },
        tracker: action.payload
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
        tracker: {
          ...state.tracker,
          name: action.payload
        },
        toggles: {
          ...state.toggles,
          profile: true
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
    case AppAction.SetStatus:
      return {
        ...state,
        status: action.payload
      }
    case AppAction.SignInUser:
      return {
        ...state,
        status: AppStatus.SignedIn,
        tracker: action.payload.tracker,
        user: action.payload.user
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