import firebase from "firebase/app";

import { Nano } from "../../../utilities/nanoUtility";

import { IGame } from "../../../../stroll-models/game";
import { defaultGameFormState, IGameFormState } from "../models/gameFormState";
import { IGameFormStateFields } from "../models/gameFormStateFields";
import { IGameUpdate } from "../../../../stroll-models/gameUpdate";
import { IUser } from "../../../models/user";

interface IGameFormUtility {
  hasChanged: (game: IGame, fields: IGameFormStateFields) => boolean;
  mapCreate: (fields: IGameFormStateFields, user: IUser) => IGame;
  mapInitialState: (game?: IGame) => IGameFormState;
  mapUpdate: (fields: IGameFormStateFields) => IGameUpdate;
}

export const GameFormUtility: IGameFormUtility = {
  hasChanged: (game: IGame, fields: IGameFormStateFields): boolean => {
    if(game) {
      return (
        game.duration !== fields.duration ||
        game.mode !== fields.mode || 
        game.name !== fields.name
      )
    }

    return true;
  },
  mapCreate: (fields: IGameFormStateFields, user: IUser): IGame => {
    return {
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
      mode: fields.mode,
      name: fields.name,
    }
  },
  mapInitialState: (game?: IGame): IGameFormState => {
    const state: IGameFormState = defaultGameFormState();
    
    if(game) {
      state.fields = {
        ...state.fields,
        duration: game.duration,
        mode: game.mode,
        name: game.name    
      }
    }

    return state;
  },
  mapUpdate: (fields: IGameFormStateFields): IGameUpdate => {
    return {
      duration: fields.duration,
      mode: fields.mode,
      name: fields.name
    }
  }
}