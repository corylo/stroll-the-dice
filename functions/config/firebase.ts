import admin from "firebase-admin";
import { config } from "firebase-functions";

import { strollTheDiceProductionAppConfig, strollTheDiceDevelopmentAppConfig } from "../../config/firebase";

const getConfig = (): any => {
  if (config().env.value === "production") {
    return strollTheDiceProductionAppConfig;
  }
  
  return strollTheDiceDevelopmentAppConfig;
};

admin.initializeApp(getConfig());

export const db: admin.firestore.Firestore = admin.firestore();