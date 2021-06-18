import firebase from "firebase/app";

import { IGameSortable } from "./game";

import { GameDuration } from "../stroll-enums/gameDuration";
import { GameMode } from "../stroll-enums/gameMode";

export interface IGameUpdate {  
  duration: GameDuration;
  locked: boolean;
  mode: GameMode,
  name: string;
  sortable: IGameSortable;
  startsAt: firebase.firestore.FieldValue;
}