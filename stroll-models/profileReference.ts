import firebase from "firebase/app";

import { Color } from "../stroll-enums/color";
import { Icon } from "../stroll-enums/icon";
import { PlayerLevelConstraint } from "../stroll-enums/playerLevelConstraint";

export interface IProfileReference {
  color: Color;
  deletedAt: firebase.firestore.FieldValue;  
  friendID: string;
  icon: Icon;
  level: number;
  name: string;
  uid: string;
  username: string;
}

export const defaultProfileReference = (): IProfileReference => ({
  color: Color.None,
  deletedAt: null,
  friendID: "",
  icon: Icon.None,
  level: PlayerLevelConstraint.MinimumLevel,
  name: "",
  uid: "",
  username: ""
});

export const deletedProfileReference = (uid: string): IProfileReference => ({
  color: Color.White,
  deletedAt: null,
  friendID: "",
  icon: Icon.UserDeleted,
  level: PlayerLevelConstraint.MinimumLevel,
  name: "Deleted",
  uid,
  username: "Deleted"
});