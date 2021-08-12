import admin from "firebase-admin";

import { strollTheDiceProductionAppConfig, strollTheDiceDevelopmentAppConfig } from "../../config/firebase";

const getConfig = (): any => {
  if (process.env.NODE_ENV === "production") {
    return strollTheDiceProductionAppConfig;
  }
  
  return strollTheDiceDevelopmentAppConfig;
};

admin.initializeApp(getConfig());

export const db: admin.firestore.Firestore = admin.firestore();