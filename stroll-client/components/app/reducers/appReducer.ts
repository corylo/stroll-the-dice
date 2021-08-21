import { IAction } from "../../../models/action";
import { IAppState } from "../models/appState";
import { defaultAppToggles } from "../models/appToggles";
import { defaultUser } from "../../../models/user";

import { AppAction } from "../../../enums/appAction";
import { AppStatus } from "../../../enums/appStatus";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";
import { StepTracker } from "../../../../stroll-enums/stepTracker";
import { StepTrackerConnectionStatus } from "../../../../stroll-enums/stepTrackerConnectionStatus";
import { IStepTrackerProfileReference } from "../../../../stroll-models/stepTrackerProfileReference";

export const appReducer = (state: IAppState, action: IAction): IAppState => {  
  switch (action.type) {    
    case AppAction.CloseModals:
      return {
        ...state,
        toggles: defaultAppToggles()
      }
    case AppAction.CompleteAccountDeletion:
      return {
        ...state,              
        status: AppStatus.SignedOut,
        statuses: {
          ...state.statuses,
          deleteAccount: {
            ...state.statuses.deleteAccount,
            is: RequestStatus.Success
          }
        },
        toggles: {
          ...state.toggles,
          deleteAccount: false
        },
        user: defaultUser()
      }
    case AppAction.FailedAccountDeletion:
      return {
        ...state,              
        statuses: {
          ...state.statuses,
          deleteAccount: {
            is: RequestStatus.Error,
            message: action.payload
          }
        }
      }
    case AppAction.FailedStepTrackerConnection:
      return {
        ...state,  
        user: {
          ...state.user,
          profile: {
            ...state.user.profile,
            tracker: {
              ...state.user.profile.tracker,
              name: action.payload,
              status: StepTrackerConnectionStatus.ConnectionFailed
            }
          }
        }
      }
    case AppAction.InitiateAccountDeletion:
      return {
        ...state,              
        statuses: {
          ...state.statuses,
          deleteAccount: {
            is: RequestStatus.Loading,
            message: ""
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
        user: {
          ...state.user,
          profile: {
            ...state.user.profile,
            tracker: {
              ...state.user.profile.tracker,
              name: action.payload,
              status: StepTrackerConnectionStatus.Initiated
            }
          }
        }
      }
    case AppAction.ResetStepTrackerConnection: {
      const tracker: IStepTrackerProfileReference = action.payload || {
        ...state.user.profile.tracker,
        name: StepTracker.Unknown,
        status: StepTrackerConnectionStatus.Idle
      };
      
      return {
        ...state,     
        user: {
          ...state.user,
          profile: {
            ...state.user.profile,
            tracker
          }
        }
      } 
    }
    case AppAction.SetGameDays: {
      return {
        ...state,
        user: {
          ...state.user,
          stats: {
            ...state.user.stats,
            gameDays: action.payload
          }
        }
      }
    }
    case AppAction.SetNotificationStats:
      return {
        ...state,
        user: {
          ...state.user,
          stats: {
            ...state.user.stats,
            notifications: action.payload
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
    case AppAction.SetStepTrackerConnectionStatus:
      return {
        ...state,  
        user: {
          ...state.user,
          profile: {
            ...state.user.profile,
            tracker: {
              ...state.user.profile.tracker,
              status: action.payload
            }
          }
        }
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
    case AppAction.ToggleDeleteAccount: {
      const updates: IAppState = {
        ...state,
        toggles: {
          ...state.toggles,
          deleteAccount: action.payload
        }
      }

      if(action.payload === false) {        
        updates.statuses = {
          ...state.statuses,
          deleteAccount: {
            is: RequestStatus.Idle,
            message: ""
          }
        };
      }

      return updates;
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