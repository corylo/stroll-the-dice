import firebase from "firebase/app";

import { DateUtility } from "../../stroll-utilities/dateUtility";
import { Nano } from "./nanoUtility";
import { UrlUtility } from "./urlUtility";

import { IGame } from "../../stroll-models/game";
import { IInvite } from "../../stroll-models/invite";
import { IUser } from "../models/user";

interface IInviteUtility {
  getLink: (gameID: string, inviteID: string) => string;
  mapCreate: (uid: string) => IInvite;
  showInvite: (id: string, invite: IInvite, game: IGame, user: IUser) => boolean;
}

export const InviteUtility: IInviteUtility = {
  getLink: (gameID: string, inviteID: string): string => {
    return UrlUtility.getLink(`/game/${gameID}?invite=${inviteID}`);
  },
  mapCreate: (uid: string): IInvite => {
    return {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      duration: DateUtility.daysToMillis(365),
      id: Nano.generate(28),
      ref: {
        creator: uid,
        team: "",
      },
      uses: {
        current: 0,
        max: 10000
      }
    }
  },
  showInvite: (id: string, invite: IInvite, game: IGame, user: IUser): boolean => {
    return (
      invite === null &&
      id !== null &&
      user !== null && 
      user.profile !== null &&
      game.id !== "" &&
      user.profile.uid !== game.creator.uid
    )
  }
}