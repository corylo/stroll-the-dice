import { useEffect } from "react";

import firebase from "firebase/app";

import { auth } from "../firebase";

import { ProfileService } from "../services/profileService";

import { ErrorUtility } from "../utilities/errorUtility";
import { UserUtility } from "../utilities/userUtility";

import { IAppState } from "../components/app/models/appState";
import { IUser } from "../models/user";

import { AppAction } from "../enums/appAction";
import { AppStatus } from "../enums/appStatus";
import { DocumentType } from "../../stroll-enums/documentType";

export const useAuthStateChangedEffect = (appState: IAppState, dispatch: (type: AppAction, payload?: any) => void): void => {
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (firebaseUser: firebase.User) => {      
      if(firebaseUser && appState.user === null) {        
        const user: IUser = UserUtility.mapUser(firebaseUser);
        
        try {
          user.profile = await ProfileService.get.by.uid(user.profile.uid);

          dispatch(AppAction.SignInUser, user);
        } catch (err) {
          console.error(err);
          
          if(err.message === ErrorUtility.doesNotExist(DocumentType.Profile)) {
            dispatch(AppAction.SignInUserForFirstTime, user);
          }
        }
      } else if (appState.user === null) {
        dispatch(AppAction.SetStatus, AppStatus.SignedOut);
      }
    });

    return () => unsub();
  }, [appState.user]);
}