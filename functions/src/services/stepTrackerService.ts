import firebase from "firebase-admin";
import { https, logger } from "firebase-functions";
import axios from "axios";

import { db } from "../../config/firebase";

import { GameDurationUtility } from "../../../stroll-utilities/gameDurationUtility";
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
  disconnectStepTracker: (data: any, context: https.CallableContext) => Promise<void>;
  get: (uid: string) => Promise<IStepTracker>;
  getAccessTokenFromRefreshToken: (tracker: StepTracker, refreshToken: string) => Promise<string>;
  getStepCountUpdate: (game: IGame, playerID: string, steps: number) => Promise<IMatchupSideStepUpdate>;
  getStepCountUpdates: (game: IGame, matchups: IMatchup[]) => Promise<IMatchupSideStepUpdate[]>;
}

export const StepTrackerService: IStepTrackerService = {
  connectStepTracker: async (request: IConnectStepTrackerRequest, context: https.CallableContext): Promise<void> => {
    if(
      context.auth !== null && 
      context.auth.uid === request.uid && 
      request.authorizationCode && 
      request.authorizationCode.trim() !== ""
    ) {
      logger.info(`Connecting step tracker [${request.tracker.name}] for user [${request.uid}]`);

      try {
        const res: any = await axios.post(
          StepTrackerUtility.getOAuthUrl(request.tracker.name), 
          StepTrackerUtility.getAccessTokenRequestData(request.authorizationCode, request.origin),
          StepTrackerUtility.getAccessTokenRequestHeaders()
        );

        const tracker: IStepTracker = {
          name: request.tracker.name,
          refreshToken: res.data.refresh_token
        }

        const batch: firebase.firestore.WriteBatch = db.batch();

        const trackerRef: firebase.firestore.DocumentReference = db.collection("profiles")
          .doc(request.uid)
          .collection("trackers")
          .doc(request.tracker.name)
          .withConverter(stepTrackerConverter);

        batch.set(trackerRef, tracker);

        const profileRef: firebase.firestore.DocumentReference = db.collection("profiles")
          .doc(request.uid)
          .withConverter(profileConverter);

        batch.update(profileRef, { tracker: tracker.name });

        await batch.commit();
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
  disconnectStepTracker: async (data: any, context: https.CallableContext): Promise<void> => {
    if(context.auth !== null) {
      const userID: string = context.auth.uid;

      logger.info(`Disconnecting step tracker for user [${userID}]`);
      
      try {
        const tracker: IStepTracker = await StepTrackerService.get(userID);

        if(tracker) {
          await axios.post(
            `${StepTrackerUtility.getOAuthRevokeUrl(tracker.name)}${tracker.refreshToken}`,
            {},
            StepTrackerUtility.getAccessTokenRequestHeaders()
          );

          const batch: firebase.firestore.WriteBatch = db.batch();

          const profileRef: firebase.firestore.DocumentReference = db.collection("profiles")
            .doc(userID);

          batch.update(profileRef, { tracker: "" });

          const trackerRef: firebase.firestore.DocumentReference = db.collection("profiles")
            .doc(userID)
            .collection("trackers")
            .doc(tracker.name);

          batch.delete(trackerRef);
            
          await batch.commit();
        } else {
          throw new Error(`Tracker for user [${context.auth.uid}] does not exist`);
        }
      } catch (err) {
        logger.error(err);
    
        throw new https.HttpsError(
          "internal",
          "Disconnecting of step tracker failed due to an internal error."
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
      StepTrackerUtility.getRefreshTokenRequestData(refreshToken),
      StepTrackerUtility.getAccessTokenRequestHeaders()
    );

    return res.data.access_token;
  },
  getStepCountUpdate: async (game: IGame, playerID: string, currentStepTotal: number): Promise<IMatchupSideStepUpdate> => {
    const tracker: IStepTracker = await StepTrackerService.get(playerID);

    const update: IMatchupSideStepUpdate = {
      id: playerID,
      steps: currentStepTotal
    }

    try {
      if(tracker && tracker.refreshToken !== "") {
        const accessToken: string = await StepTrackerService.getAccessTokenFromRefreshToken(tracker.name, tracker.refreshToken);

        const day: number = GameDurationUtility.getDay(game),
          hasDayPassed: boolean = GameDurationUtility.hasDayPassed(game);

        const res: any = await axios.post(
          StepTrackerUtility.getStepDataRequestUrl(tracker.name), 
          StepTrackerUtility.getStepDataRequestBody(tracker.name, game.startsAt, day, hasDayPassed),
          StepTrackerUtility.getStepDataRequestHeaders(accessToken)
        );

        const newStepTotal: number = StepTrackerUtility.mapStepsFromResponse(res.data, currentStepTotal, hasDayPassed);

        update.steps = newStepTotal - currentStepTotal;
      } else {
        throw new Error(`No tracker connected for user [${playerID}]`);
      }
    } catch (err) {
      logger.error(err);
      
      update.steps = NumberUtility.random(0, 250);
    }

    return update;
  },  
  getStepCountUpdates: async (game: IGame, matchups: IMatchup[]): Promise<IMatchupSideStepUpdate[]> => {
    let updates: IMatchupSideStepUpdate[] = [];

    for(let matchup of matchups) {
      const leftUpdate: IMatchupSideStepUpdate = await StepTrackerService.getStepCountUpdate(game, matchup.left.profile.uid, matchup.left.steps),
        rightUpdate: IMatchupSideStepUpdate = await StepTrackerService.getStepCountUpdate(game, matchup.right.profile.uid, matchup.right.steps);

      updates = [...updates, leftUpdate, rightUpdate];
    }

    return updates;
  }
}