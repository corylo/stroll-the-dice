import firebase from "firebase/app";

import { GameUtility } from "../functions/src/utilities/gameUtility";

import { IGame } from "../stroll-models/game";
import { IGameEvent } from "../stroll-models/gameEvent/gameEvent";
import { IGameUpdateEvent } from "../stroll-models/gameEvent/gameUpdateEvent";

import { GameEventReferenceID } from "../stroll-enums/gameEventReferenceID";
import { GameEventType } from "../stroll-enums/gameEventType";

interface IGameEventUtility {
  mapFromFirestore: (id: string, event: any) => any;
  mapGeneralEvent: (occurredAt: firebase.firestore.FieldValue, type: GameEventType) => IGameEvent;
  mapUpdateEvent: (occurredAt: firebase.firestore.FieldValue, before: IGame, after: IGame) => IGameEvent;
  mapToFirestore: (event: any) => any;
}

export const GameEventUtility: IGameEventUtility = {  
  mapFromFirestore: (id: string, event: any): any => {
    const from: any = {
      id,
      occurredAt: event.occurredAt,
      referenceID: event.referenceID,
      type: event.type   
    }

    if(event.type === GameEventType.Updated) {
      const updateEvent: IGameUpdateEvent = event;

      from.after = updateEvent.after;
      from.before = updateEvent.before;
    }

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

    return to;
  }
}