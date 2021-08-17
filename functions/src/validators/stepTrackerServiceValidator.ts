import { logger } from "firebase-functions";

import { StepTrackerUtility } from "../utilities/stepTrackerUtility";

import { IConnectStepTrackerRequest } from "../../../stroll-models/connectStepTrackerRequest";

interface IStepTrackerServiceValidator {
  validateConnectStepTrackerRequest: (request: IConnectStepTrackerRequest) => boolean;
}

export const StepTrackerServiceValidator: IStepTrackerServiceValidator = {
  validateConnectStepTrackerRequest: (request: IConnectStepTrackerRequest): boolean => {
    try {
      return (
        request.authorizationCode && 
        typeof request.authorizationCode === "string" &&
        request.authorizationCode.trim() !== "" &&
        request.timezone && 
        typeof request.timezone === "string" &&
        request.timezone.trim() !== "" &&
        Intl.DateTimeFormat(undefined, {timeZone: request.timezone}) !== null &&
        StepTrackerUtility.isValidStepTracker(request.tracker.name)
      )
    } catch (err) {
      logger.error("Connect step tracker request validation failed.", err);
    }

    return false;
  }
}