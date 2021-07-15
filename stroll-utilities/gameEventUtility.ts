import firebase from "firebase/app";

import { DateUtility } from "./dateUtility";
import { FirestoreDateUtility } from "./firestoreDateUtility";
import { GameUtility } from "../functions/src/utilities/gameUtility";

import { IDayCompletedEvent } from "../stroll-models/gameEvent/dayCompletedEvent";
import { IGame } from "../stroll-models/game";
import { IGameEvent } from "../stroll-models/gameEvent/gameEvent";
import { IGameUpdateEvent } from "../stroll-models/gameEvent/gameUpdateEvent";
import { IMatchupProfileReference } from "../stroll-models/matchupProfileReference";
import { IPlayerCreatedEvent } from "../stroll-models/gameEvent/playerCreatedEvent";
import { IPlayerCreatedPredictionEvent } from "../stroll-models/gameEvent/playerCreatedPredictionEvent";
import { IPlayerEarnedPointsFromStepsEvent } from "../stroll-models/gameEvent/playerEarnedPointsFromStepsEvent";
import { IPlayerUpdatedPredictionEvent } from "../stroll-models/gameEvent/playerUpdatedPredictionEvent";
import { IProfileReference } from "../stroll-models/profileReference";

import { Color } from "../stroll-enums/color";
import { GameEventReferenceID } from "../stroll-enums/gameEventReferenceID";
import { GameEventType } from "../stroll-enums/gameEventType";
import { Icon } from "../stroll-enums/icon";

interface IGameEventUtility {
  getColor: (type: GameEventType, playerColor: Color) => Color;
  getIcon: (type: GameEventType) => Icon;
  getLabel: (type: GameEventType) => string;
  mapDayCompletedEvent: (occurredAt: firebase.firestore.FieldValue, day: number) => IDayCompletedEvent;
  mapFromFirestore: (id: string, event: any) => any;
  mapGeneralEvent: (occurredAt: firebase.firestore.FieldValue, type: GameEventType) => IGameEvent;  
  mapPlayerCreatedEvent: (occurredAt: firebase.firestore.FieldValue, profile: IProfileReference) => IPlayerCreatedEvent;
  mapPlayerCreatedPredictionEvent: (creatorID: string, occurredAt: firebase.firestore.FieldValue, playerID: string, matchup: IMatchupProfileReference, amount: number) => IPlayerCreatedPredictionEvent;
  mapPlayerEarnedPointsFromStepsEvent: (playerID: string, occurredAt: firebase.firestore.FieldValue, points: number) => IPlayerEarnedPointsFromStepsEvent;
  mapPlayerEvent: (playerID: string, occurredAt: firebase.firestore.FieldValue, type: GameEventType) => IGameEvent;
  mapPlayerUpdatedPredictionEvent: (creatorID: string, occurredAt: firebase.firestore.FieldValue, playerID: string, matchup: IMatchupProfileReference, beforeAmount: number, afterAmount: number) => IPlayerUpdatedPredictionEvent;
  mapToFirestore: (event: any) => any;
  mapUpdateEvent: (occurredAt: firebase.firestore.FieldValue, before: IGame, after: IGame) => IGameUpdateEvent;  
}

export const GameEventUtility: IGameEventUtility = {  
  getColor: (type: GameEventType, playerColor: Color): Color => {
    switch(type) {
      case GameEventType.Created:
      case GameEventType.Started:
      case GameEventType.Updated:
      case GameEventType.PlayerCreated:
        return Color.History;
      case GameEventType.PlayerCreatedPrediction:
      case GameEventType.PlayerEarnedPointsFromSteps:
      case GameEventType.PlayerUpdatedPrediction:
        return playerColor;
      default:
        return Color.Gray5;
    }
  },
  getIcon: (type: GameEventType): Icon => {
    switch(type) {
      case GameEventType.Created:
      case GameEventType.Started:
      case GameEventType.Updated:
        return Icon.Dice;
      case GameEventType.PlayerCreated:
        return Icon.User;
      case GameEventType.PlayerEarnedPointsFromSteps:
        return Icon.Steps;
      case GameEventType.PlayerCreatedPrediction:
      case GameEventType.PlayerUpdatedPrediction:
        return Icon.Dice;
      default:
        return Icon.None;
    }
  },
  getLabel: (type: GameEventType): string => {
    switch(type) {
      case GameEventType.PlayerCreated:
        return "Player Joined";
      case GameEventType.PlayerCreatedPrediction:
        return "Prediction Created";
      case GameEventType.PlayerEarnedPointsFromSteps:
        return "Points Earned From Stepping";
      case GameEventType.PlayerUpdatedPrediction:
        return "Prediction Updated";
      default:
        return type;
    }
  },
  mapDayCompletedEvent: (occurredAt: firebase.firestore.FieldValue, day: number): IDayCompletedEvent => {
    const event: IGameEvent = GameEventUtility.mapGeneralEvent(occurredAt, GameEventType.DayCompleted);

    return {
      ...event,
      day
    }
  },
  mapFromFirestore: (id: string, event: any): any => {
    const from: any = GameEventUtility.mapToFirestore(event);
    
    from.id = id;

    return from;
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
  mapPlayerEarnedPointsFromStepsEvent: (playerID: string, occurredAt: firebase.firestore.FieldValue, points: number): IPlayerEarnedPointsFromStepsEvent => {
    const event: IGameEvent = GameEventUtility.mapPlayerEvent(playerID, occurredAt, GameEventType.PlayerEarnedPointsFromSteps);

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
  mapToFirestore: (unidentifiedEvent: any): any => {
    const to: any = {      
      occurredAt: unidentifiedEvent.occurredAt,
      referenceID: unidentifiedEvent.referenceID,
      type: unidentifiedEvent.type
    }

    if(unidentifiedEvent.type === GameEventType.Updated) {
      const event: IGameUpdateEvent = unidentifiedEvent;

      to.after = event.after;
      to.before = event.before;
    } else if(unidentifiedEvent.type === GameEventType.PlayerCreated) {
      const event: IPlayerCreatedEvent = unidentifiedEvent;

      to.profile = event.profile;
    } else if(unidentifiedEvent.type === GameEventType.PlayerEarnedPointsFromSteps) {
      const event: IPlayerEarnedPointsFromStepsEvent = unidentifiedEvent;

      to.points = event.points;
    } else if(unidentifiedEvent.type === GameEventType.PlayerCreatedPrediction) {
      const event: IPlayerCreatedPredictionEvent = unidentifiedEvent;

      to.amount = event.amount;
      to.matchup = event.matchup;
      to.playerID = event.playerID;
    } else if(unidentifiedEvent.type === GameEventType.PlayerUpdatedPrediction) {
      const event: IPlayerUpdatedPredictionEvent = unidentifiedEvent;

      to.afterAmount = event.afterAmount;
      to.beforeAmount = event.beforeAmount;
      to.matchup = event.matchup;
      to.playerID = event.playerID;
    } else if (unidentifiedEvent.type === GameEventType.DayCompleted) {
      const event: IDayCompletedEvent = unidentifiedEvent;

      to.day = event.day;
    }

    return to;
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