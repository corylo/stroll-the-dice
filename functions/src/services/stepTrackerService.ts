import firebase from "firebase-admin";
import { https, logger } from "firebase-functions";
import axios from "axios";

import { db } from "../../config/firebase";

import { ProfileService } from "./profileService";
import { StepTrackerRequestService } from "./stepTrackerRequestService";

import { StepTrackerServiceValidator } from "../validators/stepTrackerServiceValidator";

import { FirestoreDateUtility } from "../utilities/firestoreDateUtility";
import { GameDurationUtility } from "../../../stroll-utilities/gameDurationUtility";
import { StepTrackerUtility } from "../utilities/stepTrackerUtility";

import { IConnectStepTrackerRequest } from "../../../stroll-models/connectStepTrackerRequest";
import { IGame } from "../../../stroll-models/game";
import { IMatchup } from "../../../stroll-models/matchup";
import { IMatchupSideStepUpdate } from "../../../stroll-models/matchupSideStepUpdate";
import { IOAuthRefreshTokenResponse } from "../../../stroll-models/oauthRefreshTokenResponse";
import { IProfile, profileConverter } from "../../../stroll-models/profile";
import { IStepTracker, stepTrackerConverter } from "../../../stroll-models/stepTracker";
import { defaultStepTrackerProfileReference, IStepTrackerProfileReference } from "../../../stroll-models/stepTrackerProfileReference";
import { IStepTrackerProfileReferenceUpdate } from "../../../stroll-models/stepTrackerProfileReferenceUpdate";

import { StepTracker } from "../../../stroll-enums/stepTracker";
import { StepTrackerConnectionStatus } from "../../../stroll-enums/stepTrackerConnectionStatus";

interface IStepTrackerService {
  clearStepTracker: (uid: string, tracker: StepTracker) => Promise<void>;
  connectStepTracker: (request: IConnectStepTrackerRequest, context: https.CallableContext) => Promise<void>;
  disconnectStepTracker: (data: any, context: https.CallableContext) => Promise<void>;  
  get: (uid: string) => Promise<IStepTracker>;
  getStepCountUpdate: (game: IGame, playerID: string, steps: number) => Promise<IMatchupSideStepUpdate>;
  getStepCountUpdates: (game: IGame, matchups: IMatchup[]) => Promise<IMatchupSideStepUpdate[]>;
  preauthorizedDisconnectStepTracker: (uid: string) => Promise<void>;  
  saveStepTracker: (uid: string, request: IConnectStepTrackerRequest, tokens: IOAuthRefreshTokenResponse) => Promise<void>;
  updateStepTrackerProfileReference: (uid: string, updates: IStepTrackerProfileReferenceUpdate) => Promise<void>;
  updateStepTrackerTokens: (uid: string, tracker: StepTracker, tokens: IOAuthRefreshTokenResponse) => Promise<void>;
  verifyStepTracker: (data: any, context: https.CallableContext) => Promise<void>;
}

export const StepTrackerService: IStepTrackerService = {
  clearStepTracker: async (uid: string, tracker: StepTracker): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    const profileRef: firebase.firestore.DocumentReference = db.collection("profiles")
      .doc(uid);

    batch.update(profileRef, { tracker: defaultStepTrackerProfileReference() });

    const trackerRef: firebase.firestore.DocumentReference = db.collection("profiles")
      .doc(uid)
      .collection("trackers")
      .doc(tracker);

    batch.delete(trackerRef);
      
    await batch.commit();
  },
  connectStepTracker: async (request: IConnectStepTrackerRequest, context: https.CallableContext): Promise<void> => {
    if(
      context.auth !== null && 
      context.auth.uid === request.uid && 
      StepTrackerServiceValidator.validateConnectStepTrackerRequest(request)      
    ) {
      logger.info(`Connecting step tracker [${request.tracker.name}] for user [${request.uid}]`);

      try {
        const tokens: IOAuthRefreshTokenResponse = await StepTrackerRequestService.getAccessTokenAndRefreshToken(request);

        await StepTrackerService.saveStepTracker(context.auth.uid, request, tokens);
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
      try {
        await StepTrackerService.preauthorizedDisconnectStepTracker(context.auth.uid);
      } catch (err) {
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
  getStepCountUpdate: async (game: IGame, playerID: string, currentStepTotal: number): Promise<IMatchupSideStepUpdate> => {
    const profile: IProfile = await ProfileService.get.by.uid(playerID),
      tracker: IStepTracker = await StepTrackerService.get(playerID);

    const update: IMatchupSideStepUpdate = {
      id: playerID,
      steps: 0
    }

    if(tracker && tracker.refreshToken !== "") {
      try {
        const day: number = GameDurationUtility.getDay(game),
          hasDayPassed: boolean = GameDurationUtility.hasDayPassed(game);

        const timestamp: firebase.firestore.FieldValue = FirestoreDateUtility.timestampToTimezoneOffsetTimestamp(
          game.startsAt,
          profile.tracker.timezone
        )

        const total: number = await StepTrackerRequestService.getStepCountUpdate(playerID, tracker, timestamp, day, hasDayPassed);
          
        update.steps = total - currentStepTotal;
      } catch (err) {
        logger.error(err);

        await StepTrackerService.updateStepTrackerProfileReference(playerID, {
          status: StepTrackerConnectionStatus.VerificationFailed
        });
      }
    }

    return update;
  },  
  getStepCountUpdates: async (game: IGame, matchups: IMatchup[]): Promise<IMatchupSideStepUpdate[]> => {
    let updates: IMatchupSideStepUpdate[] = [];

    for(let matchup of matchups) {
      if(matchup.left.playerID !== "") {
        const leftUpdate: IMatchupSideStepUpdate = await StepTrackerService.getStepCountUpdate(game, matchup.left.playerID, matchup.left.steps);

        updates = [...updates, leftUpdate];
      }
      
      if(matchup.right.playerID !== "") {
        const rightUpdate: IMatchupSideStepUpdate = await StepTrackerService.getStepCountUpdate(game, matchup.right.playerID, matchup.right.steps);

        updates = [...updates, rightUpdate];
      }
    }

    return updates;
  },
  preauthorizedDisconnectStepTracker: async (uid: string): Promise<void> => {
    const tracker: IStepTracker = await StepTrackerService.get(uid);

    if(tracker) {
      logger.info(`Disconnecting step tracker [${tracker.name}] for user [${uid}]`);
      
      try {
        await axios.post(
          StepTrackerUtility.getOAuthRevokeUrl(tracker.name, tracker.refreshToken),
          {},
          StepTrackerUtility.getAccessTokenRequestHeaders(tracker.name)
        );

        await StepTrackerService.clearStepTracker(uid, tracker.name);
      } catch (err) {
        logger.error(err);

        throw new Error(`Revoking of OAuth access failed for user [${uid}]`);
      }
    } else {
      throw new Error(`Tracker for user [${uid}] does not exist`);
    }
  },
  saveStepTracker: async (uid: string, request: IConnectStepTrackerRequest, tokens: IOAuthRefreshTokenResponse): Promise<void> => {
    await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {  
      const tracker: IStepTracker = {
        accessToken: tokens.accessToken,
        name: request.tracker.name,
        refreshToken: tokens.refreshToken
      }
  
      const trackersRef: firebase.firestore.Query = db.collection("profiles")
        .doc(uid)
        .collection("trackers")
        .withConverter(stepTrackerConverter);

      const trackerSnap: firebase.firestore.QuerySnapshot = await transaction.get(trackersRef);

      if(trackerSnap.empty || trackerSnap.size === 0) {
        const trackerRef: firebase.firestore.DocumentReference = db.collection("profiles")
          .doc(uid)
          .collection("trackers")
          .doc(request.tracker.name)
          .withConverter(stepTrackerConverter);

        transaction.set(trackerRef, tracker);

        const profileRef: firebase.firestore.DocumentReference = db.collection("profiles")
          .doc(uid)
          .withConverter(profileConverter);

        const stepTrackerProfileReference: IStepTrackerProfileReference = {
          name: tracker.name,
          status: StepTrackerConnectionStatus.Connected,
          timezone: request.timezone
        }

        transaction.update(profileRef, { tracker: stepTrackerProfileReference });
      } else {
        throw new Error("User already has tracker connected");
      }
    });
  },
  updateStepTrackerProfileReference: async (uid: string, updates: IStepTrackerProfileReferenceUpdate): Promise<void> => {
    const updateFields: any = {}

    if(updates.name) {
      updateFields["tracker.name"] = updates.name;
    }

    if(updates.status) {
      updateFields["tracker.status"] = updates.status;
    }

    if(updates.timezone) {
      updateFields["tracker.timezone"] = updates.timezone;
    }

    await db.collection("profiles")
      .doc(uid)
      .withConverter(profileConverter)
      .update(updateFields);
  },
  updateStepTrackerTokens: async (uid: string, tracker: StepTracker, tokens: IOAuthRefreshTokenResponse): Promise<void> => {
    await db.collection("profiles")
      .doc(uid)
      .collection("trackers")
      .doc(tracker)
      .update({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      });
  },
  verifyStepTracker: async (data: any, context: https.CallableContext): Promise<void> => {
    if(context.auth !== null) {
      const tracker: IStepTracker = await StepTrackerService.get(context.auth.uid),
        profile: IProfile = await ProfileService.get.by.uid(context.auth.uid);

      try {
        const timestamp: firebase.firestore.FieldValue = FirestoreDateUtility.timestampToTimezoneOffsetTimestamp(
          FirestoreDateUtility.beginningOfHour(firebase.firestore.Timestamp.now()),
          profile.tracker.timezone
        );
    
        await StepTrackerRequestService.getStepCountUpdate(context.auth.uid, tracker, timestamp, 1, false);

        await StepTrackerService.updateStepTrackerProfileReference(context.auth.uid, {
          status: StepTrackerConnectionStatus.Verified
        });
      } catch (err) {
        if(profile.tracker.status !== StepTrackerConnectionStatus.VerificationFailed) {
          await StepTrackerService.updateStepTrackerProfileReference(context.auth.uid, {
            status: StepTrackerConnectionStatus.VerificationFailed
          });
        }

        logger.error(err);

        throw new https.HttpsError(
          "internal",
          "Verification of step tracker failed due to an internal error."
        );
      }
    } else {
      throw new https.HttpsError(
        "permission-denied",
        "User does not have permission to perform this action."
      );
    }
  }
}