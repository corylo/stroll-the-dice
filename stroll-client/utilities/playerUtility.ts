import firebase from "firebase/app";
import { IGame } from "../../stroll-models/game";

import { IInvite } from "../../stroll-models/invite";
import { IPlayer } from "../../stroll-models/player";
import { IProfile } from "../../stroll-models/profile";

interface IPlayerUtility {  
  mapCreate: (profile: IProfile, game: IGame, invite: IInvite) => IPlayer;
}

export const PlayerUtility: IPlayerUtility = {
  mapCreate: (profile: IProfile, game: IGame, invite: IInvite): IPlayer => {
    return {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      id: "",      
      profile,
      ref: {
        game: game.id,
        invite: invite.id
      },
      team: ""
    }
  }
}