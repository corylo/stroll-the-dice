import firebase from "firebase-admin";

import { db } from "../../config/firebase";

import { GameUtility } from "./gameUtility";

import { IDayCompletedEvent } from "../../../stroll-models/gameEvent/dayCompletedEvent";
import { IGame } from "../../../stroll-models/game";
import { gameEventConverter, IGameEvent } from "../../../stroll-models/gameEvent/gameEvent";
import { IGameUpdateEvent } from "../../../stroll-models/gameEvent/gameUpdateEvent";
import { IMatchupPlayerReference } from "../../../stroll-models/matchupProfileReference";
import { IPlayerCreatedEvent } from "../../../stroll-models/gameEvent/playerCreatedEvent";
import { IPlayerCreatedPredictionEvent } from "../../../stroll-models/gameEvent/playerCreatedPredictionEvent";
import { IPlayerDayCompletedSummaryEvent } from "../../../stroll-models/gameEvent/playerDayCompletedSummaryEvent";
import { IPlayerEarnedPointsFromStepsEvent } from "../../../stroll-models/gameEvent/playerEarnedPointsFromStepsEvent";
import { IPlayerUpdatedPredictionEvent } from "../../../stroll-models/gameEvent/playerUpdatedPredictionEvent";

import { GameEventCategory } from "../../../stroll-enums/gameEventCategory";
import { GameEventReferenceID } from "../../../stroll-enums/gameEventReferenceID";
import { GameEventType } from "../../../stroll-enums/gameEventType";
import { IPlayerDayCompletedSummary } from "../../../stroll-models/playerDayCompletedSummary";

interface IGameEventUtility {
  getPredictionMatchupQuery: (gameID: string, playerID: string, eventType: GameEventType, profileWhereClause: string) => firebase.firestore.Query;
  mapDayCompletedEvent: (occurredAt: firebase.firestore.FieldValue, day: number) => IDayCompletedEvent;  
  mapGeneralEvent: (occurredAt: firebase.firestore.FieldValue, type: GameEventType) => IGameEvent;  
  mapPlayerCreatedEvent: (occurredAt: firebase.firestore.FieldValue, playerID: string) => IPlayerCreatedEvent;
  mapPlayerCreatedPredictionEvent: (creatorID: string, occurredAt: firebase.firestore.FieldValue, playerID: string, matchup: IMatchupPlayerReference, amount: number) => IPlayerCreatedPredictionEvent;
  mapPlayerDayCompletedSummaryEvent: (playerID: string, occurredAt: firebase.firestore.FieldValue, summary: IPlayerDayCompletedSummary) => IPlayerDayCompletedSummaryEvent
  mapPlayerEarnedPointsFromStepsEvent: (playerID: string, occurredAt: firebase.firestore.FieldValue, points: number) => IPlayerEarnedPointsFromStepsEvent;
  mapPlayerEvent: (playerID: string, occurredAt: firebase.firestore.FieldValue, category: GameEventCategory, type: GameEventType) => IGameEvent;
  mapPlayerUpdatedPredictionEvent: (creatorID: string, occurredAt: firebase.firestore.FieldValue, playerID: string, matchup: IMatchupPlayerReference, beforeAmount: number, afterAmount: number) => IPlayerUpdatedPredictionEvent;  
  mapUpdateEvent: (occurredAt: firebase.firestore.FieldValue, before: IGame, after: IGame) => IGameUpdateEvent;  
}

export const GameEventUtility: IGameEventUtility = {  
  getPredictionMatchupQuery: (gameID: string, playerID: string, eventType: GameEventType, profileWhereClause: string): firebase.firestore.Query => {
    return db.collection("games")
      .doc(gameID)
      .collection("events")
      .where("type", "==", eventType)
      .where(profileWhereClause, "==", playerID)
      .withConverter<IGameEvent>(gameEventConverter);
  },
  mapDayCompletedEvent: (occurredAt: firebase.firestore.FieldValue, day: number): IDayCompletedEvent => {
    const event: IGameEvent = GameEventUtility.mapGeneralEvent(occurredAt, GameEventType.DayCompleted);

    return {
      ...event,
      day
    }
  },
  mapGeneralEvent: (occurredAt: firebase.firestore.FieldValue, type: GameEventType): IGameEvent => {
    return {
      category: GameEventCategory.Game,
      id: "",
      occurredAt,
      referenceID: GameEventReferenceID.General,
      type
    }
  },
  mapPlayerCreatedEvent: (occurredAt: firebase.firestore.FieldValue, playerID: string): IPlayerCreatedEvent => {
    const event: IGameEvent = GameEventUtility.mapGeneralEvent(occurredAt, GameEventType.PlayerCreated);

    return {
      ...event,
      playerID
    }
  },
  mapPlayerCreatedPredictionEvent: (creatorID: string, occurredAt: firebase.firestore.FieldValue, playerID: string, matchup: IMatchupPlayerReference, amount: number): IPlayerCreatedPredictionEvent => {
    const event: IGameEvent = GameEventUtility.mapPlayerEvent(creatorID, occurredAt, GameEventCategory.Prediction, GameEventType.PlayerCreatedPrediction);

    return {
      ...event,
      amount,
      matchup,
      playerID
    }
  },
  mapPlayerDayCompletedSummaryEvent: (playerID: string, occurredAt: firebase.firestore.FieldValue, summary: IPlayerDayCompletedSummary): IPlayerDayCompletedSummaryEvent => {
    const event: IGameEvent = GameEventUtility.mapPlayerEvent(playerID, occurredAt, GameEventCategory.Game, GameEventType.PlayerDayCompletedSummary);

    return {
      ...event,
      day: summary.day,
      gained: summary.gained,
      lost: summary.lost,
      overall: summary.overall,
      received: summary.received,
      steps: summary.steps,
      wagered: summary.wagered
    }
  },
  mapPlayerEarnedPointsFromStepsEvent: (playerID: string, occurredAt: firebase.firestore.FieldValue, points: number): IPlayerEarnedPointsFromStepsEvent => {
    const event: IGameEvent = GameEventUtility.mapPlayerEvent(playerID, occurredAt, GameEventCategory.Steps, GameEventType.PlayerEarnedPointsFromSteps);

    return {
      ...event,
      points
    }
  },
  mapPlayerUpdatedPredictionEvent: (creatorID: string, occurredAt: firebase.firestore.FieldValue, playerID: string, matchup: IMatchupPlayerReference, beforeAmount: number, afterAmount: number): IPlayerUpdatedPredictionEvent => {
    const event: IGameEvent = GameEventUtility.mapPlayerEvent(creatorID, occurredAt, GameEventCategory.Prediction, GameEventType.PlayerUpdatedPrediction);

    return {
      ...event,
      afterAmount,
      beforeAmount,
      matchup,
      playerID
    }
  },
  mapPlayerEvent: (playerID: string, occurredAt: firebase.firestore.FieldValue, category: GameEventCategory, type: GameEventType): IGameEvent => {
    return {
      category,
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