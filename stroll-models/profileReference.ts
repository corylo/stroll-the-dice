import firebase from "firebase/app";

import { Color } from "../stroll-enums/color";
import { Icon } from "../stroll-enums/icon";

export interface IProfileReference {
  color: Color;
  deletedAt: firebase.firestore.FieldValue;  
  experience: number;
  friendID: string;
  icon: Icon;
  name: string;
  uid: string;
  username: string;
}

export const defaultProfileReference = (): IProfileReference => ({
  color: Color.None,
  deletedAt: null,
  experience: 0,
  friendID: "",
  icon: Icon.None,
  name: "",
  uid: "",
  username: ""
});