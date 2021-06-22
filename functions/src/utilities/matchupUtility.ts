import firebase from "firebase-admin";

import { defaultMatchupSideTotal, IMatchup } from "../../../stroll-models/matchup";
import { IPlayer } from "../../../stroll-models/player";

interface IMatchupUtility {  
  mapCreate: (player: IPlayer) => IMatchup;
}

export const MatchupUtility: IMatchupUtility = {   
  mapCreate: (player: IPlayer): IMatchup => {
    return {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      day: 1,
      id: "",
      left: {
        ref: player.id,
        steps: 0,
        total: defaultMatchupSideTotal()
      },
      right: {
        ref: "",
        steps: 0,
        total: defaultMatchupSideTotal()
      }
    }
  }
}