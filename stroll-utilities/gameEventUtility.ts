import { IDayCompletedEvent } from "../stroll-models/gameEvent/dayCompletedEvent";
import { IGameUpdateEvent } from "../stroll-models/gameEvent/gameUpdateEvent";
import { IPlayerCreatedEvent } from "../stroll-models/gameEvent/playerCreatedEvent";
import { IPlayerCreatedPredictionEvent } from "../stroll-models/gameEvent/playerCreatedPredictionEvent";
import { IPlayerDayCompletedSummaryEvent } from "../stroll-models/gameEvent/playerDayCompletedSummaryEvent";
import { IPlayerEarnedPointsFromStepsEvent } from "../stroll-models/gameEvent/playerEarnedPointsFromStepsEvent";
import { IPlayerUpdatedPredictionEvent } from "../stroll-models/gameEvent/playerUpdatedPredictionEvent";

import { IGameEvent } from "../stroll-models/gameEvent/gameEvent";

import { Color } from "../stroll-enums/color";
import { GameEventType } from "../stroll-enums/gameEventType";
import { Icon } from "../stroll-enums/icon";

interface IGameEventUtility {
  getColor: (type: GameEventType, playerColor: Color) => Color;
  getIcon: (type: GameEventType) => Icon;
  getLabel: (event: IGameEvent) => string;
  mapFromFirestore: (id: string, event: any) => any;
  mapToFirestore: (event: any) => any;
}

export const GameEventUtility: IGameEventUtility = {  
  getColor: (type: GameEventType, playerColor: Color): Color => {
    switch(type) {
      case GameEventType.Completed:
      case GameEventType.Created:
      case GameEventType.DayCompleted:
      case GameEventType.Started:
      case GameEventType.Updated:
      case GameEventType.PlayerCreated:
        return Color.History;
      case GameEventType.PlayerCreatedPrediction:
      case GameEventType.PlayerEarnedPointsFromSteps:
      case GameEventType.PlayerUpdatedPrediction:
      case GameEventType.PlayerDayCompletedSummary:
        return playerColor;
      default:
        return Color.Gray5;
    }
  },
  getIcon: (type: GameEventType): Icon => {
    switch(type) {
      case GameEventType.Completed:
      case GameEventType.Created:
      case GameEventType.DayCompleted:
      case GameEventType.Started:
      case GameEventType.Updated:
        return Icon.Dice;
      case GameEventType.PlayerCreated:
      case GameEventType.PlayerDayCompletedSummary:
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
  getLabel: (event: IGameEvent): string => {
    switch(event.type) {
      case GameEventType.DayCompleted: {
        const e: IDayCompletedEvent = event as IDayCompletedEvent;

        return `Day ${e.day} Complete`;
      }
      case GameEventType.PlayerCreated:
        return "Player Joined";
      case GameEventType.PlayerCreatedPrediction:
        return "Prediction Created";
      case GameEventType.PlayerDayCompletedSummary: {
        const e: IPlayerDayCompletedSummaryEvent = event as IPlayerDayCompletedSummaryEvent;

        return `Day ${e.day} Summary`;
      }
      case GameEventType.PlayerEarnedPointsFromSteps:
        return "Points Earned From Stepping";
      case GameEventType.PlayerUpdatedPrediction:
        return "Prediction Updated";
      default:
        return event.type;
    }
  },
  mapFromFirestore: (id: string, event: any): any => {
    const from: any = GameEventUtility.mapToFirestore(event);
    
    from.id = id;

    return from;
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
    } else if (unidentifiedEvent.type === GameEventType.PlayerDayCompletedSummary) {
      const event: IPlayerDayCompletedSummaryEvent = unidentifiedEvent;

      to.day = event.day;
      to.points = event.points;
      to.steps = event.steps;
    }

    return to;
  }
}