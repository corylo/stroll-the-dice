import firebase from "firebase/app";

import { IInvite } from "../../stroll-models/invite";
import { IPlayer } from "../../stroll-models/player";
import { IProfile } from "../../stroll-models/profile";

interface IPlayerUtility {  
  mapCreate: (profile: IProfile, invite: IInvite) => IPlayer;
}

export const PlayerUtility: IPlayerUtility = {
  mapCreate: (profile: IProfile, invite: IInvite): IPlayer => {
    return {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      id: "",
      inviteID: invite.id,
      profile,
      team: ""
    }
  }
}