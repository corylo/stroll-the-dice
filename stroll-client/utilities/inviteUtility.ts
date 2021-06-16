import firebase from "firebase/app";

import { DateUtility } from "./dateUtility";
import { Nano } from "./nanoUtility";
import { UrlUtility } from "./urlUtility";

import { IGame } from "../../stroll-models/game";
import { IInvite } from "../../stroll-models/invite";
import { IProfile } from "../../stroll-models/profile";

interface IInviteUtility {
  getLink: (invite: IInvite) => string;
  mapCreate: (game: IGame, creator: IProfile) => IInvite;
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
      id: Nano.generate(),
      ref: {
        game: game.id,
        team: "",
      },
      uses: {
        current: 0,
        max: 10000
      }
    }
  }
}