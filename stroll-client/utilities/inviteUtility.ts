import firebase from "firebase/app";

import { DateUtility } from "./dateUtility";

import { IGame } from "../../stroll-models/game";
import { IInvite } from "../../stroll-models/invite";
import { IProfile } from "../../stroll-models/profile";

interface IInviteUtility {
  mapCreate: (game: IGame, creator: IProfile) => IInvite;
}

export const InviteUtility: IInviteUtility = {
  mapCreate: (game: IGame, creator: IProfile): IInvite => {
    return {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      creator,
      duration: DateUtility.daysToMillis(365),
      id: "",
      ref: {
        game: game.id,
        team: "",
      },
      uses: {
        current: 0,
        max: 1000
      }
    }
  }
}