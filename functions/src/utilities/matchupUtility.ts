import firebase from "firebase-admin";

import { IGame } from "../../../stroll-models/game";
import { defaultMatchupSideTotal, IMatchup } from "../../../stroll-models/matchup";
import { IMatchupPairGroup } from "../../../stroll-models/matchupPairGroup";
import { IPlayer } from "../../../stroll-models/player";

interface IMatchupUtility {  
  generatePairGroups: (numberOfDays: number, numberOfPlayers: number) => IMatchupPairGroup[];
  mapCreate: (game: IGame, player: IPlayer) => IMatchup;
  mapDayOneCreate: (player: IPlayer) => IMatchup;
}

export const MatchupUtility: IMatchupUtility = {   
  generatePairGroups: (numberOfDays: number, numberOfPlayers: number): IMatchupPairGroup[] => {
    // Day 1 matchups
    // 1,2 | 3,4 | 5,6 | 7,8 | 9,10
    
    // Day 2+ matchups
    /*
      - 1. Create list of all possible matchups. [1,2|1,3|1,4|etc.] (pairwise combinations)                
      - 2. Remove day 1 matchups
      - 3. Randomly select any matchup
      - 4. Remove all matchups containing left or right from the selected matchup
      - 5. Repeat steps 3 & 4 until none left
    */
    return [];
  },
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
      },
      winner: ""
    }
  }
}