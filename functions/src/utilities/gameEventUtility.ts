import firebase from "firebase/app";

import { FirestoreDateUtility } from "./firestoreDateUtility";
import { GameUtility } from "./gameUtility";

import { IDayCompletedEvent } from "../../../stroll-models/gameEvent/dayCompletedEvent";
import { IGame } from "../../../stroll-models/game";
import { IGameEvent } from "../../../stroll-models/gameEvent/gameEvent";
import { IGameUpdateEvent } from "../../../stroll-models/gameEvent/gameUpdateEvent";
import { IMatchupProfileReference } from "../../../stroll-models/matchupProfileReference";
import { IPlayerCreatedEvent } from "../../../stroll-models/gameEvent/playerCreatedEvent";
import { IPlayerCreatedPredictionEvent } from "../../../stroll-models/gameEvent/playerCreatedPredictionEvent";
import { IPlayerDayCompletedSummaryEvent } from "../../../stroll-models/gameEvent/playerDayCompletedSummaryEvent";
import { IPlayerEarnedPointsFromStepsEvent } from "../../../stroll-models/gameEvent/playerEarnedPointsFromStepsEvent";
import { IPlayerUpdatedPredictionEvent } from "../../../stroll-models/gameEvent/playerUpdatedPredictionEvent";
import { IProfileReference } from "../../../stroll-models/profileReference";

import { GameEventReferenceID } from "../../../stroll-enums/gameEventReferenceID";
import { GameEventType } from "../../../stroll-enums/gameEventType";

interface IGameEventUtility {
  mapDayCompletedEvent: (occurredAt: firebase.firestore.FieldValue, day: number) => IDayCompletedEvent;  
  mapGeneralEvent: (occurredAt: firebase.firestore.FieldValue, type: GameEventType) => IGameEvent;  
  mapPlayerCreatedEvent: (occurredAt: firebase.firestore.FieldValue, profile: IProfileReference) => IPlayerCreatedEvent;
  mapPlayerCreatedPredictionEvent: (creatorID: string, occurredAt: firebase.firestore.FieldValue, playerID: string, matchup: IMatchupProfileReference, amount: number) => IPlayerCreatedPredictionEvent;
  mapPlayerDayCompletedSummaryEvent: (playerID: string, occurredAt: firebase.firestore.FieldValue, day: number, points: number, steps: number) => IPlayerDayCompletedSummaryEvent
  mapPlayerEarnedPointsFromStepsEvent: (playerID: string, occurredAt: firebase.firestore.FieldValue, points: number) => IPlayerEarnedPointsFromStepsEvent;
  mapPlayerEvent: (playerID: string, occurredAt: firebase.firestore.FieldValue, type: GameEventType) => IGameEvent;
  mapPlayerUpdatedPredictionEvent: (creatorID: string, occurredAt: firebase.firestore.FieldValue, playerID: string, matchup: IMatchupProfileReference, beforeAmount: number, afterAmount: number) => IPlayerUpdatedPredictionEvent;  
  mapUpdateEvent: (occurredAt: firebase.firestore.FieldValue, before: IGame, after: IGame) => IGameUpdateEvent;  
}

export const GameEventUtility: IGameEventUtility = {  
  mapDayCompletedEvent: (occurredAt: firebase.firestore.FieldValue, day: number): IDayCompletedEvent => {
    const event: IGameEvent = GameEventUtility.mapGeneralEvent(occurredAt, GameEventType.DayCompleted);

    return {
      ...event,
      day
    }
  },
  mapGeneralEvent: (occurredAt: firebase.firestore.FieldValue, type: GameEventType): IGameEvent => {
    return {
      id: "",
      occurredAt,
      referenceID: GameEventReferenceID.General,
      type
    }
  },
  mapPlayerCreatedEvent: (occurredAt: firebase.firestore.FieldValue, profile: IProfileReference): IPlayerCreatedEvent => {
    const event: IGameEvent = GameEventUtility.mapGeneralEvent(occurredAt, GameEventType.PlayerCreated);

    return {
      ...event,
      profile
    }
  },
  mapPlayerCreatedPredictionEvent: (creatorID: string, occurredAt: firebase.firestore.FieldValue, playerID: string, matchup: IMatchupProfileReference, amount: number): IPlayerCreatedPredictionEvent => {
    const event: IGameEvent = GameEventUtility.mapPlayerEvent(creatorID, occurredAt, GameEventType.PlayerCreatedPrediction);

    return {
      ...event,
      amount,
      matchup,
      playerID
    }
  },
  mapPlayerDayCompletedSummaryEvent: (playerID: string, occurredAt: firebase.firestore.FieldValue, day: number, points: number, steps: number): IPlayerDayCompletedSummaryEvent => {
    const event: IGameEvent = GameEventUtility.mapPlayerEvent(playerID, occurredAt, GameEventType.PlayerDayCompletedSummary);

    return {
      ...event,
      day,
      points,
      steps
    }
  },
  mapPlayerEarnedPointsFromStepsEvent: (playerID: string, occurredAt: firebase.firestore.FieldValue, points: number): IPlayerEarnedPointsFromStepsEvent => {
    const date: Date = FirestoreDateUtility.timestampToDate(occurredAt);

    date.setSeconds(0, 0);

    const event: IGameEvent = GameEventUtility.mapPlayerEvent(playerID, FirestoreDateUtility.dateToTimestamp(date), GameEventType.PlayerEarnedPointsFromSteps);

    return {
      ...event,
      points
    }
  },
  mapPlayerUpdatedPredictionEvent: (creatorID: string, occurredAt: firebase.firestore.FieldValue, playerID: string, matchup: IMatchupProfileReference, beforeAmount: number, afterAmount: number): IPlayerUpdatedPredictionEvent => {
    const event: IGameEvent = GameEventUtility.mapPlayerEvent(creatorID, occurredAt, GameEventType.PlayerUpdatedPrediction);

    return {
      ...event,
      afterAmount,
      beforeAmount,
      matchup,
      playerID
    }
  },
  mapPlayerEvent: (playerID: string, occurredAt: firebase.firestore.FieldValue, type: GameEventType): IGameEvent => {
    return {
      id: "",
      occurredAt,
      referenceID: playerID,
      type
    }
  },
  mapUpdateEvent: (occurredAt: firebase.firestore.FieldValue, before: IGame, after: IGame): IGameUpdateEvent => {
    const event: IGameEvent = GameEventUtility.mapGeneralEvent(occurredAt, GameEventType.Updated);

    return {
      ...event,
      before: GameUtility.mapUpdates(after, before),
      after: GameUtility.mapUpdates(before, after)
    }
  }
}