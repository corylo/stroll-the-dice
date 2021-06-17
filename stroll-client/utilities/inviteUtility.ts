import firebase from "firebase/app";

import { DateUtility } from "./dateUtility";
import { UrlUtility } from "./urlUtility";

import { IGame } from "../../stroll-models/game";
import { IInvite } from "../../stroll-models/invite";
import { IProfile } from "../../stroll-models/profile";
import { IUser } from "../models/user";
import { Nano } from "./nanoUtility";

interface IInviteUtility {
  getLink: (invite: IInvite) => string;
  mapCreate: (game: IGame, creator: IProfile) => IInvite;
  showInvite: (id: string, invite: IInvite, game: IGame, user: IUser) => boolean;
}

export const InviteUtility: IInviteUtility = {
  getLink: (invite: IInvite): string => {
    return UrlUtility.getLink(`/game/${invite.ref.game}?invite=${invite.id}`);
  },
  mapCreate: (game: IGame, creator: IProfile): IInvite => {
    return {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      creator,
      duration: DateUtility.daysToMillis(365),
      id: Nano.generate(28),
      ref: {
        game: game.id,
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
      game !== null &&
      user.profile.uid !== game.creator.uid
    )
  }
}