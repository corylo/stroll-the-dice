import firebase from "firebase-admin";

import { db } from "../../../config/firebase";

import { MatchupTransactionService } from "./matchupTransactionService";

import { FirestoreDateUtility } from "../../utilities/firestoreDateUtility";
import { PlayerUtility } from "../../utilities/playerUtility";
import { PredictionUtility } from "../../utilities/predictionUtility";

import { gameDaySummaryConverter, IGameDaySummary } from "../../../../stroll-models/gameDaySummary";
import { IMatchup } from "../../../../stroll-models/matchup";
import { IPlayer } from "../../../../stroll-models/player";
import { IPrediction, predictionConverter } from "../../../../stroll-models/prediction";

interface IPredictionTransactionService {
  refundAllPredictions: (gameID: string, updatedSummary: IGameDaySummary, matchups: IMatchup[], predictions: IPrediction[]) => Promise<void>;
  setRefundedAtOnAllPredictions: (transaction: firebase.firestore.Transaction, predictions: IPrediction[]) => void;
}

export const PredictionTransactionService: IPredictionTransactionService = {
  refundAllPredictions: async (gameID: string, updatedSummary: IGameDaySummary, matchups: IMatchup[], predictions: IPrediction[]): Promise<void> => {
    const playersRef: firebase.firestore.Query = PlayerUtility.getPlayersRef(gameID);

    const gameDaySummaryRef: firebase.firestore.DocumentReference<IGameDaySummary> = db.collection("games")
      .doc(gameID)
      .collection("day_summaries")
      .doc(updatedSummary.day.toString())
      .withConverter<IGameDaySummary>(gameDaySummaryConverter);

    await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
      const playerSnap: firebase.firestore.QuerySnapshot = await transaction.get(playersRef);

      playerSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => {
        const player: IPlayer = doc.data() as IPlayer,
          refundAmount: number = PredictionUtility.sumOneSidedPredictions(player.id, predictions);

        if(refundAmount > 0) {
          transaction.update(doc.ref, {
            ["points.available"]: player.points.available + refundAmount
          });
        }
      });

      transaction.update(gameDaySummaryRef, updatedSummary);

      PredictionTransactionService.setRefundedAtOnAllPredictions(transaction, predictions);

      MatchupTransactionService.resetOneSidedMatchups(transaction, gameID, matchups);
    });
  },
  setRefundedAtOnAllPredictions: (transaction: firebase.firestore.Transaction, predictions: IPrediction[]): void => {
    predictions.forEach((prediction: IPrediction) => {
      const ref: firebase.firestore.DocumentReference<IPrediction> =  db.collection("games")      
        .doc(prediction.ref.game)
        .collection("matchups")
        .doc(prediction.ref.matchup)
        .collection("predictions")
        .doc(prediction.id)
        .withConverter<IPrediction>(predictionConverter);

      transaction.update(ref, {          
        refundedAt: FirestoreDateUtility.beginningOfHour(firebase.firestore.Timestamp.now())
      });
    });
  }
}