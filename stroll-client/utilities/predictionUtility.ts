import firebase from "firebase/app";

import { IPrediction } from "../../stroll-models/prediction";

interface IPredictionUtility {
  mapCreate: (amount: number, creatorID: string, gameID: string, matchupID: string, playerID: string) => IPrediction;
}

export const PredictionUtility: IPredictionUtility = {
  mapCreate: (amount: number, creatorID: string, gameID: string, matchupID: string, playerID: string): IPrediction => {
    return {
      amount,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      id: "",
      ref: {
        creator: creatorID,
        game: gameID,
        matchup: matchupID,
        player: playerID
      },
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }
  }
}