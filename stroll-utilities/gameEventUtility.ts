import firebase from "firebase/app";

import { GameUtility } from "../functions/src/utilities/gameUtility";

import { IGame } from "../stroll-models/game";
import { IGameEvent } from "../stroll-models/gameEvent/gameEvent";
import { IGameUpdateEvent } from "../stroll-models/gameEvent/gameUpdateEvent";
import { IPlayerCreatedEvent } from "../stroll-models/gameEvent/playerCreatedEvent";
import { IProfileReference } from "../stroll-models/profileReference";

import { Color } from "../stroll-enums/color";
import { GameEventReferenceID } from "../stroll-enums/gameEventReferenceID";
import { GameEventType } from "../stroll-enums/gameEventType";

interface IGameEventUtility {
  getColor: (type: GameEventType) => Color;
  getLabel: (type: GameEventType) => string;
  mapFromFirestore: (id: string, event: any) => any;
  mapGeneralEvent: (occurredAt: firebase.firestore.FieldValue, type: GameEventType) => IGameEvent;
  mapPlayerCreatedEvent: (occurredAt: firebase.firestore.FieldValue, profile: IProfileReference) => IPlayerCreatedEvent;
  mapUpdateEvent: (occurredAt: firebase.firestore.FieldValue, before: IGame, after: IGame) => IGameUpdateEvent;
  mapToFirestore: (event: any) => any;
}

export const GameEventUtility: IGameEventUtility = {  
  getColor: (type: GameEventType): Color => {
    switch(type) {
      case GameEventType.Created:
      case GameEventType.Updated:
        return Color.Blue2;
      case GameEventType.PlayerCreated:
        return Color.Green1;
      default:
        return Color.Gray5;
    }
  },
  getLabel: (type: GameEventType): string => {
    switch(type) {
      case GameEventType.PlayerCreated:
        return "Player Joined";
      default:
        return type;
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
  mapUpdateEvent: (occurredAt: firebase.firestore.FieldValue, before: IGame, after: IGame): IGameUpdateEvent => {
    const event: IGameEvent = GameEventUtility.mapGeneralEvent(occurredAt, GameEventType.Updated);

    return {
      ...event,
      before: GameUtility.mapUpdates(after, before),
      after: GameUtility.mapUpdates(before, after)
    }
  },
  mapToFirestore: (event: any): any => {
    const to: any = {      
      occurredAt: event.occurredAt,
      referenceID: event.referenceID,
      type: event.type
    }

    if(event.type === GameEventType.Updated) {
      const updateEvent: IGameUpdateEvent = event;

      to.after = updateEvent.after;
      to.before = updateEvent.before;
    }

    if(event.type === GameEventType.PlayerCreated) {
      const playerCreatedEvent: IPlayerCreatedEvent = event;

      to.profile = playerCreatedEvent.profile;
    }

    return to;
  }
}