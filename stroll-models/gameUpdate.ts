import firebase from "firebase/app";

import { IGameSortable } from "./game";

import { GameDuration } from "../stroll-enums/gameDuration";
import { GameMode } from "../stroll-enums/gameMode";
import { GameStatus } from "../stroll-enums/gameStatus";

export interface IGameUpdate {  
  duration?: GameDuration;
  locked?: boolean;
  mode?: GameMode,
  name?: string;
  progressUpdateAt?: firebase.firestore.FieldValue;
  sortable?: IGameSortable;
  startsAt?: firebase.firestore.FieldValue;
  status?: GameStatus;
}