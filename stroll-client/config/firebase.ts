import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

export const strollTheDiceProductionAppConfig: any = {
  apiKey: "AIzaSyBSPelvz0KfQ4CNENn15_rUQZkYH8dqtOk",
  authDomain: "stroll-the-dice.firebaseapp.com",
  projectId: "stroll-the-dice",
  storageBucket: "stroll-the-dice.appspot.com",
  messagingSenderId: "933905839245",
  appId: "1:933905839245:web:3110bc6895f7f98cfcdec4",
  measurementId: "G-SNS5B90NX9"
};

export const strollTheDiceDevelopmentAppConfig: any = {
  apiKey: "AIzaSyBSPelvz0KfQ4CNENn15_rUQZkYH8dqtOk",
  authDomain: "stroll-the-dice.firebaseapp.com",
  projectId: "stroll-the-dice",
  storageBucket: "stroll-the-dice.appspot.com",
  messagingSenderId: "933905839245",
  appId: "1:933905839245:web:3110bc6895f7f98cfcdec4",
  measurementId: "G-SNS5B90NX9"
};

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