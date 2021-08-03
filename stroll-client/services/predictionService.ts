import firebase from "firebase/app";

import { db } from "../config/firebase";

import { IPlayer } from "../../stroll-models/player";
import { IPrediction, predictionConverter } from "../../stroll-models/prediction";
import { IPredictionUpdate } from "../../stroll-models/predictionUpdate";

interface IPredictionService {
  create: (prediction: IPrediction) => Promise<void>;  
  update: (prediction: IPrediction, update: IPredictionUpdate) => Promise<void>;  
}

export const PredictionService: IPredictionService = {
  create: async (prediction: IPrediction): Promise<void> => {
    const predictionRef: firebase.firestore.DocumentReference = db.collection("games")
      .doc(prediction.ref.game)
      .collection("matchups")
      .doc(prediction.ref.matchup)
      .collection("predictions")
      .doc(prediction.ref.creator)
      .withConverter(predictionConverter);

    const playerRef: firebase.firestore.DocumentReference = db.collection("games")
      .doc(prediction.ref.game)
      .collection("players")
      .doc(prediction.ref.creator);

    return await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
      const playerDoc: firebase.firestore.DocumentSnapshot = await transaction.get(playerRef);

      if(playerDoc.exists) {
        const player: IPlayer = { ...playerDoc.data() as IPlayer, id: playerDoc.id };  

        transaction.set(predictionRef, prediction);

        transaction.update(playerRef, { 
          ["points.available"]: player.points.available - prediction.amount,
          ["ref.lastMatchupPredicted"]: prediction.ref.matchup,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    });
  },
  update: async (prediction: IPrediction, update: IPredictionUpdate): Promise<void> => {
    const predictionRef: firebase.firestore.DocumentReference = db.collection("games")
      .doc(prediction.ref.game)
      .collection("matchups")
      .doc(prediction.ref.matchup)
      .collection("predictions")
      .doc(prediction.ref.creator)
      .withConverter(predictionConverter);

    const playerRef: firebase.firestore.DocumentReference = db.collection("games")
      .doc(prediction.ref.game)
      .collection("players")
      .doc(prediction.ref.creator);

    return await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
      const predictionDoc: firebase.firestore.DocumentSnapshot = await transaction.get(predictionRef),
        playerDoc: firebase.firestore.DocumentSnapshot = await transaction.get(playerRef);

      if(predictionDoc.exists && playerDoc.exists) {
        const retrievedPrediction: IPrediction = { ...predictionDoc.data() as IPrediction, id: predictionDoc.id },
          player: IPlayer = { ...playerDoc.data() as IPlayer, id: playerDoc.id };  

        transaction.update(predictionRef, update);

        const delta: number = update.amount - retrievedPrediction.amount;

        transaction.update(playerRef, { 
          ["points.available"]: player.points.available - delta,
          ["ref.lastMatchupPredicted"]: prediction.ref.matchup,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    });
  }
}