import { db } from "../firebase";

import { IPrediction, predictionConverter } from "../../stroll-models/prediction";
import { IPredictionUpdate } from "../../stroll-models/predictionUpdate";

interface IPredictionService {
  create: (prediction: IPrediction) => Promise<void>;  
  update: (prediction: IPrediction, update: IPredictionUpdate) => Promise<void>;  
}

export const PredictionService: IPredictionService = {
  create: async (prediction: IPrediction): Promise<void> => {
    return await db.collection("games")
      .doc(prediction.ref.game)
      .collection("matchups")
      .doc(prediction.ref.matchup)
      .collection("predictions")
      .doc(prediction.ref.creator)
      .withConverter(predictionConverter)
      .set(prediction);
  },
  update: async (prediction: IPrediction, update: IPredictionUpdate): Promise<void> => {
    return await db.collection("games")
      .doc(prediction.ref.game)
      .collection("matchups")
      .doc(prediction.ref.matchup)
      .collection("predictions")
      .doc(prediction.ref.creator)
      .withConverter(predictionConverter)
      .update(update);
  }
}