import firebase from "firebase/app";

import { GameDuration } from "../stroll-enums/gameDuration";
import { GameMode } from "../stroll-enums/gameMode";

export interface IGameUpdate {  
  duration: GameDuration;
  mode: GameMode,
  name: string;
  startsAt: firebase.firestore.FieldValue;
}