import firebase from "firebase-admin";

import { IGame } from "../../../stroll-models/game";
import { defaultMatchupSideTotal, IMatchup } from "../../../stroll-models/matchup";
import { IPlayer } from "../../../stroll-models/player";

interface IMatchupUtility {  
  mapCreate: (game: IGame, player: IPlayer) => IMatchup;
  mapDayOneCreate: (player: IPlayer) => IMatchup;
}

export const MatchupUtility: IMatchupUtility = {   
  mapCreate: (game: IGame, player: IPlayer): IMatchup => {
    const matchup: IMatchup = MatchupUtility.mapDayOneCreate(player);
    
    matchup.day = 1; // Calculate day from startedAt

    return matchup;
  },
  mapDayOneCreate: (player: IPlayer): IMatchup => {
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