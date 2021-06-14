import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/analytics";
import "firebase/auth";

import { strollTheDiceDevelopmentAppConfig, strollTheDiceProductionAppConfig } from "../config/firebaseConfig";

const getConfig = (): any => {
  if (process.env.NODE_ENV === "production") {
    return strollTheDiceProductionAppConfig;
  }
  
  return strollTheDiceDevelopmentAppConfig;
};

firebase.initializeApp(getConfig());

export const db: firebase.firestore.Firestore = firebase.firestore();
export const analytics: firebase.analytics.Analytics = firebase.analytics();
export const auth: firebase.auth.Auth = firebase.auth();