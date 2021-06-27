import firebase from "firebase/app";

import { FirestoreDateUtility } from "../../../../stroll-utilities/firestoreDateUtility";
import { Nano } from "../../../utilities/nanoUtility";

import { IGame } from "../../../../stroll-models/game";
import { defaultGameFormState, IGameFormState } from "../models/gameFormState";
import { IGameFormStateFields } from "../models/gameFormStateFields";
import { IGameUpdate } from "../../../../stroll-models/gameUpdate";
import { IUser } from "../../../models/user";

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
        FirestoreDateUtility.timestampToDateInput(game.startsAt) !== fields.startsAt
      )
    }

    return true;
  },
  isValidGameStatus: (gameStatus: GameStatus): boolean => {
    return gameStatus === undefined || gameStatus === GameStatus.Upcoming;
  },
  mapCreate: (fields: IGameFormStateFields, user: IUser): IGame => {    
    return {
      counts: {
        players: 1,
        teams: 0
      },
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      creator: {
        color: user.profile.color,
        icon: user.profile.icon,
        id: user.profile.id,
        uid: user.profile.uid,
        username: user.profile.username
      },
      duration: fields.duration,
      id: Nano.generate(),
      locked: false,
      mode: fields.mode,
      name: fields.name,
      sortable: {
        name: fields.name.toLowerCase()
      },
      startsAt: FirestoreDateUtility.stringToOffsetTimestamp(fields.startsAt),
      status: GameStatus.Upcoming
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
        startsAt: FirestoreDateUtility.timestampToDateInput(game.startsAt)
      }
    }

    return state;
  },
  mapUpdate: (fields: IGameFormStateFields): IGameUpdate => {
    return {
      duration: fields.duration,
      locked: fields.locked,
      mode: fields.mode,
      name: fields.name,
      sortable: {
        name: fields.name.toLowerCase(),
      },
      startsAt: FirestoreDateUtility.stringToOffsetTimestamp(fields.startsAt)
    }
  }
}