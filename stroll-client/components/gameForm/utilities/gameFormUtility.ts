import firebase from "firebase/app";

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
  hasChanged: (game: IGame, fields: IGameFormStateFields) => boolean;
  isValidGameStatus: (gameStatus: GameStatus) => boolean;
  mapCreate: (fields: IGameFormStateFields, user: IUser) => IGame;
  mapInitialState: (game?: IGame) => IGameFormState;
  mapUpdate: (fields: IGameFormStateFields) => IGameUpdate;
}

export const GameFormUtility: IGameFormUtility = {
  hasChanged: (game: IGame, fields: IGameFormStateFields): boolean => {
    if(game) {
      return (
        game.duration !== fields.duration ||
        game.locked !== fields.locked ||
        game.mode !== fields.mode || 
        game.name !== fields.name ||
        FirestoreDateUtility.timestampToDateInput(game.startsAt) !== fields.startsAt ||
        FirestoreDateUtility.timestampToDate(game.startsAt).getHours() !== fields.startsAtHour ||
        game.enableGiftDaysForJoiningPlayers !== fields.enableGiftDaysForJoiningPlayers
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
      creator: {
        color: user.profile.color,
        icon: user.profile.icon,
        name: user.profile.name,
        uid: user.profile.uid,
        username: user.profile.username
      },
      duration: fields.duration,
      endsAt,
      error: GameError.None,
      id: Nano.generate(),
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
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      enableGiftDaysForJoiningPlayers: fields.enableGiftDaysForJoiningPlayers
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
        startsAtHour: FirestoreDateUtility.timestampToDate(game.startsAt).getHours(),
        enableGiftDaysForJoiningPlayers: game.enableGiftDaysForJoiningPlayers
      }
    }

    return state;
  },
  mapUpdate: (fields: IGameFormStateFields): IGameUpdate => {
    const startsAt: firebase.firestore.FieldValue = FirestoreDateUtility.stringToOffsetTimestamp(fields.startsAt, fields.startsAtHour),
      endsAt: firebase.firestore.FieldValue = FirestoreDateUtility.dateToTimestamp(new Date(GameDurationUtility.getEndsAt(startsAt, fields.duration) * 1000));

    return {
      endsAt,
      enableGiftDaysForJoiningPlayers: fields.enableGiftDaysForJoiningPlayers,
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