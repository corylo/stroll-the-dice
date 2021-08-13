import { useEffect } from "react";
import firebase from "firebase/app";

import { auth, db } from "../config/firebase";

import { ProfileService } from "../services/profileService";
import { RoleService } from "../services/roleService";

import { ErrorUtility } from "../utilities/errorUtility";
import { UserUtility } from "../utilities/userUtility";

import { IAppState } from "../components/app/models/appState";
import { IProfileGameDayStats, IProfileNotificationStats } from "../../stroll-models/profileStats";
import { IUser } from "../models/user";

import { AppAction } from "../enums/appAction";
import { AppStatus } from "../enums/appStatus";
import { DocumentType } from "../../stroll-enums/documentType";
import { ProfileStatsID } from "../../stroll-enums/profileStatsID";

export const useAuthStateChangedEffect = (appState: IAppState, dispatch: (type: AppAction, payload?: any) => void): void => {
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (firebaseUser: firebase.User) => {      
      if(firebaseUser && appState.user.profile.uid === "") {        
        const user: IUser = UserUtility.mapUser(firebaseUser);
        
        try {
          user.profile = await ProfileService.get.by.uid(user.profile.uid);
          user.roles = await RoleService.getByUID(user.profile.uid);
          
          dispatch(AppAction.SignInUser, user);
        } catch (err) {
          console.error(err);
          
          if(err.message === ErrorUtility.doesNotExist(DocumentType.Profile)) {
            dispatch(AppAction.SignInUserForFirstTime, user);
          }
        }
      } else if (appState.user.profile.uid === "") {
        dispatch(AppAction.SetStatus, AppStatus.SignedOut);
      }
    });

    return () => unsub();
  }, [appState.user]);
}

export const useGameDaysListenerEffect = (appState: IAppState, dispatch: (type: AppAction, payload?: any) => void): void => {
  useEffect(() => {  
    if(appState.user.profile.uid !== "") {   
      const { uid } = appState.user.profile;

      const unsubToGameDays = db.collection("profiles")
        .doc(uid)
        .collection("stats")
        .doc(ProfileStatsID.GameDays)
        .onSnapshot((doc: firebase.firestore.QueryDocumentSnapshot) => {
          if(doc.exists) {
            const gameDays: IProfileGameDayStats = doc.data() as IProfileGameDayStats;
            
            dispatch(AppAction.SetGameDays, gameDays);
          }
        });

      return () => unsubToGameDays();
    }
  }, [appState.user.profile.uid]);
}

export const useNotificationsListenerEffect = (appState: IAppState, dispatch: (type: AppAction, payload?: any) => void): void => {
  useEffect(() => {  
    if(appState.user.profile.uid !== "") {   
      const { uid } = appState.user.profile;

      const unsubToNotifications = db.collection("profiles")
        .doc(uid)
        .collection("stats")
        .doc(ProfileStatsID.Notifications)
        .onSnapshot((doc: firebase.firestore.QueryDocumentSnapshot) => {
          if(doc.exists) {
            const notifications: IProfileNotificationStats = doc.data() as IProfileNotificationStats;
            
            dispatch(AppAction.SetNotificationStats, notifications);
          }
        });

      return () => unsubToNotifications();
    }
  }, [appState.user.profile.uid]);
}