import firebase from "firebase-admin";
import { logger } from "firebase-functions";
import axios from "axios";

import { ProfileService } from "./profileService";
import { StepTrackerService } from "./stepTrackerService";

import { StepTrackerUtility } from "../utilities/stepTrackerUtility";

import { IConnectStepTrackerRequest } from "../../../stroll-models/connectStepTrackerRequest";
import { IOAuthRefreshTokenResponse } from "../../../stroll-models/oauthRefreshTokenResponse";
import { IProfile } from "../../../stroll-models/profile";
import { IStepTracker } from "../../../stroll-models/stepTracker";

import { StepTracker } from "../../../stroll-enums/stepTracker";

interface IStepTrackerRequestService {
  getAccessTokenAndRefreshToken: (request: IConnectStepTrackerRequest) => Promise<IOAuthRefreshTokenResponse>;
  getAccessTokenFromRefreshToken: (tracker: StepTracker, refreshToken: string) => Promise<IOAuthRefreshTokenResponse>;
  getStepCountUpdate: (uid: string, timestamp: firebase.firestore.FieldValue, day: number) => Promise<number>;  
  sendStepCountUpdateRequest: (tracker: StepTracker, accessToken: string, timestamp: firebase.firestore.FieldValue, day: number, timezone: string) => Promise<number>;
}

export const StepTrackerRequestService: IStepTrackerRequestService = {
  getAccessTokenAndRefreshToken: async (request: IConnectStepTrackerRequest): Promise<IOAuthRefreshTokenResponse> => {
    const res: any = await axios.post(
      StepTrackerUtility.getOAuthUrl(request.tracker.name), 
      StepTrackerUtility.getAccessTokenRequestData(request.tracker.name, request.authorizationCode, request.origin),
      StepTrackerUtility.getAccessTokenRequestHeaders(request.tracker.name)
    );

    return {
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token
    }
  },
  getAccessTokenFromRefreshToken: async (tracker: StepTracker, refreshToken: string): Promise<IOAuthRefreshTokenResponse> => {
    const res: any = await axios.post(
      StepTrackerUtility.getOAuthUrl(tracker), 
      StepTrackerUtility.getRefreshTokenRequestData(tracker, refreshToken),
      StepTrackerUtility.getAccessTokenRequestHeaders(tracker)
    );

    return {
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token
    }
  },
  getStepCountUpdate: async (uid: string, timestamp: firebase.firestore.FieldValue, day: number): Promise<number> => {        
    const tracker: IStepTracker = await StepTrackerService.get(uid);

    if(tracker !== null) {
      const profile: IProfile = await ProfileService.get.by.uid(uid);
      
      try {
        return await StepTrackerRequestService.sendStepCountUpdateRequest(tracker.name, tracker.accessToken, timestamp, day, profile.tracker.timezone);
      } catch (err) {}

      let tokens: IOAuthRefreshTokenResponse = null;

      try {
        tokens = await StepTrackerRequestService.getAccessTokenFromRefreshToken(tracker.name, tracker.refreshToken);
        
        await StepTrackerService.updateStepTrackerTokens(uid, tracker.name, tokens);
      } catch (err) {
        logger.error(err);

        throw new Error(`[${tracker.name}] refresh token request failed for user [${uid}].`);
      }
      
      try {     
        return await StepTrackerRequestService.sendStepCountUpdateRequest(tracker.name, tokens.accessToken, timestamp, day, profile.tracker.timezone);
      } catch (err) {
        logger.error(err);

        throw new Error(`Subsequent [${tracker.name}] step count update request failed for user [${uid}].`);
      }
    }

    return 0;
  },
  sendStepCountUpdateRequest: async (tracker: StepTracker, accessToken: string, timestamp: firebase.firestore.FieldValue, day: number, timezone: string): Promise<number> => {    
    const url: string = StepTrackerUtility.getStepDataRequestUrl(tracker, timestamp, day, timezone),
      body: any = StepTrackerUtility.getStepDataRequestBody(tracker, timestamp, day),
      headers: any = StepTrackerUtility.getStepDataRequestHeaders(accessToken);

    let res: any = null;

    if(tracker === StepTracker.GoogleFit) {
      res = await axios.post(url, body, headers);
    } else if (tracker === StepTracker.Fitbit) {
      res = await axios.get(url, headers);
    }
    
    return StepTrackerUtility.mapStepsFromResponse(tracker, res.data);
  }
}