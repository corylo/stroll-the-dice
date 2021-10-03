import firebase from "firebase/app";

import { DateUtility } from "../../../../stroll-utilities/dateUtility";
import { FirestoreDateUtility } from "../../../../stroll-utilities/firestoreDateUtility";
import { GameDurationUtility } from "../../../../stroll-utilities/gameDurationUtility";
import { Nano } from "../../../../stroll-utilities/nanoUtility";

import { IGame } from "../../../../stroll-models/game";
import { defaultGameFormState, IGameFormState } from "../models/gameFormState";
import { IGameFormStateFields } from "../models/gameFormStateFields";
import { IGameUpdate } from "../../../../stroll-models/gameUpdate";
import { IUser } from "../../../models/user";

import { GameError } from "../../../../stroll-enums/gameError";
import { GameStatus } from "../../../../stroll-enums/gameStatus";

interface IGameFormUtility {
  getStartsAt: () => string;
  getStartsAtHour: () => number;
  hasChanged: (game: IGame, fields: IGameFormStateFields) => boolean;
  isValidGameStatus: (gameStatus: GameStatus) => boolean;
  mapCreate: (fields: IGameFormStateFields, user: IUser) => IGame;
  mapInitialState: (game?: IGame) => IGameFormState;
  mapUpdate: (fields: IGameFormStateFields) => IGameUpdate;
}

export const GameFormUtility: IGameFormUtility = {
  getStartsAt: (): string => {
    const date: Date = new Date();

    const isTomorrowWithinAnHour: boolean = date.getHours() + 1 === 24;

    if(isTomorrowWithinAnHour) {
      date.setDate(date.getDate() + 1);
    }

    return DateUtility.dateToInput(date);
  },
  getStartsAtHour: (): number => {
    const date: Date = new Date();

    const isTomorrowWithinAnHour: boolean = date.getHours() + 1 === 24;

    if(isTomorrowWithinAnHour) {
      return 0;
    }

    return new Date().getHours() + 1;
  },
  hasChanged: (game: IGame, fields: IGameFormStateFields): boolean => {
    if(game) {
      return (
        game.duration !== fields.duration ||
        game.locked !== fields.locked ||
        game.mode !== fields.mode || 
        game.name !== fields.name ||
        FirestoreDateUtility.timestampToDateInput(game.startsAt) !== fields.startsAt ||
        FirestoreDateUtility.timestampToDate(game.startsAt).getHours() !== fields.startsAtHour
      )
    }

    return true;
  },
  isValidGameStatus: (gameStatus: GameStatus): boolean => {
    return gameStatus === undefined || gameStatus === GameStatus.Upcoming;
  },
  mapCreate: (fields: IGameFormStateFields, user: IUser): IGame => {    
    const startsAt: firebase.firestore.FieldValue = FirestoreDateUtility.stringToOffsetTimestamp(fields.startsAt, fields.startsAtHour),
      endsAt: firebase.firestore.FieldValue = FirestoreDateUtility.dateToTimestamp(new Date(GameDurationUtility.getEndsAt(startsAt, fields.duration) * 1000));
    
    return {
      counts: {
        players: 1,
        teams: 0
      },
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      creatorUID: user.profile.uid,
      duration: fields.duration,
      endsAt,
      error: GameError.None,
      id: Nano.generate(6),
      initializeProgressUpdateAt: null,
      locked: false,
      mode: fields.mode,
      name: fields.name,
      progressUpdateAt: null,
      sortable: {
        name: fields.name.toLowerCase()
      },
      startsAt,
      status: GameStatus.Upcoming,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }
  },
  mapInitialState: (game?: IGame): IGameFormState => {
    const state: IGameFormState = defaultGameFormState();
    
    if(game) {
      state.fields = {
        ...state.fields,
        duration: game.duration,
        locked: game.locked,
        mode: game.mode,
        name: game.name,
        startsAt: FirestoreDateUtility.timestampToDateInput(game.startsAt),
        startsAtHour: FirestoreDateUtility.timestampToDate(game.startsAt).getHours()
      }
    }

    return state;
  },
  mapUpdate: (fields: IGameFormStateFields): IGameUpdate => {
    const startsAt: firebase.firestore.FieldValue = FirestoreDateUtility.stringToOffsetTimestamp(fields.startsAt, fields.startsAtHour),
      endsAt: firebase.firestore.FieldValue = FirestoreDateUtility.dateToTimestamp(new Date(GameDurationUtility.getEndsAt(startsAt, fields.duration) * 1000));

    return {
      endsAt,
      error: GameError.None,
      locked: fields.locked,      
      name: fields.name,
      sortable: {
        name: fields.name.toLowerCase(),
      },
      startsAt,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }
  }
}