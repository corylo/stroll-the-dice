import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

import { strollTheDiceProductionAppConfig, strollTheDiceDevelopmentAppConfig } from "../../config/firebase";

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
export const functions: firebase.functions.Functions = firebase.functions();