import firebase from "firebase-admin";
import { https, logger } from "firebase-functions";
import axios from "axios";

import { db } from "../../firebase";

import { StepTrackerUtility } from "../utilities/stepTrackerUtility";

import { IConnectStepTrackerRequest } from "../../../stroll-models/connectStepTrackerRequest";
import { profileConverter } from "../../../stroll-models/profile";
import { IStepTracker, stepTrackerConverter } from "../../../stroll-models/stepTracker";

interface IStepTrackerService {
  connectStepTracker: (request: IConnectStepTrackerRequest, context: https.CallableContext) => Promise<void>;
  get: (uid: string) => Promise<IStepTracker>;
}

export const StepTrackerService: IStepTrackerService = {
  connectStepTracker: async (request: IConnectStepTrackerRequest, context: https.CallableContext): Promise<void> => {
    if(context.auth.uid === request.uid && request.authorizationCode.trim() !== "") {
      logger.info(`Adding step tracker [${request.tracker.name}] for user [${request.uid}]`);

      try {
        const res: any = await axios.post(
          "https://api.fitbit.com/oauth2/token", 
          StepTrackerUtility.getAccessTokenRequestData(request.authorizationCode),
          StepTrackerUtility.getAccessTokenRequestHeaders()
        );

        const tracker: IStepTracker = {
          accessToken: res.data.access_token,
          name: request.tracker.name,
          refreshToken: res.data.refresh_token,
          userID: res.data.user_id
        }

        await db.collection("profiles")
          .doc(request.uid)
          .collection("trackers")
          .doc(request.tracker.name)
          .withConverter(stepTrackerConverter)
          .set(tracker);

        await db.collection("profiles")
          .doc(request.uid)
          .withConverter(profileConverter)
          .update({ tracker: tracker.name });
      } catch (err) {
        logger.error(err);
    
        throw new https.HttpsError(
          "internal",
          "Connecting of step tracker failed due to an internal error."
        );
      }
    } else {
      throw new https.HttpsError(
        "permission-denied",
        "User does not have permission to perform this action."
      );
    }
  },
  get: async (uid: string): Promise<IStepTracker> => {
    if(uid !== "") {
      try {
        const snap: firebase.firestore.QuerySnapshot = await db.collection("profiles")
          .doc(uid)
          .collection("trackers")
          .withConverter(stepTrackerConverter)
          .get();

        if(!snap.empty && snap.size === 1) {
          let trackers: IStepTracker[] = [];

          snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IStepTracker>) => 
            trackers.push(doc.data()));

          return trackers[0];
        }

        throw new Error(`Expected 1 tracker. Returned ${snap.size} trackers.`);
      } catch (err) {
        return null;
      }
    }
  }
}