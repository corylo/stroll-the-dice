import firebase from "firebase-admin";
import { https, logger } from "firebase-functions";
import axios from "axios";

import { db } from "../../firebase";

import { NumberUtility } from "../../../stroll-utilities/numberUtility";
import { StepTrackerUtility } from "../utilities/stepTrackerUtility";

import { IConnectStepTrackerRequest } from "../../../stroll-models/connectStepTrackerRequest";
import { IGame } from "../../../stroll-models/game";
import { IMatchup } from "../../../stroll-models/matchup";
import { IMatchupSideStepUpdate } from "../../../stroll-models/matchupSideStepUpdate";
import { profileConverter } from "../../../stroll-models/profile";
import { IStepTracker, stepTrackerConverter } from "../../../stroll-models/stepTracker";

import { StepTracker } from "../../../stroll-enums/stepTracker";

interface IStepTrackerService {
  connectStepTracker: (request: IConnectStepTrackerRequest, context: https.CallableContext) => Promise<void>;
  get: (uid: string) => Promise<IStepTracker>;
  getAccessTokenFromRefreshToken: (tracker: StepTracker, refreshToken: string) => Promise<string>;
  getStepCountUpdate: (game: IGame, playerID: string, steps: number) => Promise<IMatchupSideStepUpdate>;
  getStepCountUpdates: (game: IGame, matchups: IMatchup[]) => Promise<IMatchupSideStepUpdate[]>;
}

export const StepTrackerService: IStepTrackerService = {
  connectStepTracker: async (request: IConnectStepTrackerRequest, context: https.CallableContext): Promise<void> => {
    if(context.auth.uid === request.uid && request.authorizationCode.trim() !== "") {
      logger.info(`Adding step tracker [${request.tracker.name}] for user [${request.uid}]`);

      try {
        const res: any = await axios.post(
          StepTrackerUtility.getOAuthUrl(request.tracker.name), 
          StepTrackerUtility.getAccessTokenRequestData(request.authorizationCode),
          StepTrackerUtility.getAccessTokenRequestHeaders()
        );

        const tracker: IStepTracker = {
          name: request.tracker.name,
          refreshToken: res.data.refresh_token
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
  },
  getAccessTokenFromRefreshToken: async (tracker: StepTracker, refreshToken: string): Promise<string> => {
    const res: any = await axios.post(
      StepTrackerUtility.getOAuthUrl(tracker), 
      StepTrackerUtility.getRefreshTokenRequestData(tracker),
      StepTrackerUtility.getAccessTokenRequestHeaders()
    );

    return res.data.access_token;
  },
  getStepCountUpdate: async (game: IGame, playerID: string, steps: number): Promise<IMatchupSideStepUpdate> => {
    const tracker: IStepTracker = await StepTrackerService.get(playerID);

    const update: IMatchupSideStepUpdate = {
      id: playerID,
      steps
    }

    try {
      if(tracker && tracker.refreshToken !== "") {
        const accessToken: string = await StepTrackerService.getAccessTokenFromRefreshToken(tracker.name, tracker.refreshToken);

        const res: any = await axios.post(
          StepTrackerUtility.getStepDataRequestUrl(tracker.name), 
          StepTrackerUtility.getStepDataRequestBody(game, tracker.name),
          StepTrackerUtility.getStepDataRequestHeaders(accessToken)
        );

        update.steps = StepTrackerUtility.mapStepsFromResponse(res.data);
      } else {
        throw new Error(`No tracker connected for user [${playerID}]`);
      }
    } catch (err) {
      logger.error(err);
      
      update.steps = NumberUtility.random(0, 500);
    }

    return update;
  },  
  getStepCountUpdates: async (game: IGame, matchups: IMatchup[]): Promise<IMatchupSideStepUpdate[]> => {
    let updates: IMatchupSideStepUpdate[] = [];

    for(let matchup of matchups) {
      const leftUpdate: IMatchupSideStepUpdate = await StepTrackerService.getStepCountUpdate(game, matchup.left.ref, matchup.left.steps),
        rightUpdate: IMatchupSideStepUpdate = await StepTrackerService.getStepCountUpdate(game, matchup.right.ref, matchup.right.steps);

      updates = [...updates, leftUpdate, rightUpdate];
    }

    return updates;
  }
}