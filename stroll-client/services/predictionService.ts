import { db } from "../firebase";

import { IPrediction, predictionConverter } from "../../stroll-models/prediction";

interface IPredictionService {
  create: (playerID: string, prediction: IPrediction) => Promise<void>;
}

export const PredictionService: IPredictionService = {
  create: async (playerID: string, prediction: IPrediction): Promise<void> => {
    await db.collection("games")
      .doc(prediction.ref.game)
      .collection("players")
      .doc(playerID)
      .collection("predictions")
      .withConverter(predictionConverter)
      .add(prediction);
  },
}