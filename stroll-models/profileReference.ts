import firebase from "firebase/app";

import { Color } from "../stroll-enums/color";
import { Icon } from "../stroll-enums/icon";

export interface IProfileReference {
  color: Color;
  deletedAt: firebase.firestore.FieldValue;  
  icon: Icon;
  name: string;
  uid: string;
  username: string;
}

export const defaultProfileReference = (): IProfileReference => ({
  color: Color.None,
  deletedAt: null,
  icon: Icon.None,
  name: "",
  uid: "",
  username: ""
});

export const deletedProfileReference = (uid: string): IProfileReference => ({
  color: Color.Gray5,
  deletedAt: null,
  icon: Icon.UserDeleted,
  name: "Deleted",
  uid,
  username: "Deleted"
});