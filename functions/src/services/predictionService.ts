import firebase from "firebase-admin";
import { Change, EventContext, logger } from "firebase-functions";

import { db } from "../../config/firebase";

import { GameEventTransactionService } from "./transaction/gameEventTransactionService";
import { PredictionTransactionService } from "./transaction/predictionTransactionService";

import { GameEventUtility } from "../utilities/gameEventUtility";
import { GameDaySummaryUtility } from "../utilities/gameDaySummaryUtility";
import { MatchupUtility } from "../utilities/matchupUtility";

import { IGameDaySummary } from "../../../stroll-models/gameDaySummary";
import { IMatchup, IMatchupSide, matchupConverter } from "../../../stroll-models/matchup";
import { IPrediction, predictionConverter } from "../../../stroll-models/prediction";

interface IPredictionService {  
  getAllByMatchup: (gameID: string, matchupID: string) => Promise<IPrediction[]>;
  getAllForMatchups: (gameID: string, matchups: IMatchup[]) => Promise<IPrediction[]>;
  onCreate: (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext) => Promise<void>;
  onUpdate: (change: Change<firebase.firestore.QueryDocumentSnapshot<IPrediction>>, context: EventContext) => Promise<void>;
  refundAllOneSidedPredictions: (gameID: string, summary: IGameDaySummary) => Promise<void>;
}

export const PredictionService: IPredictionService = {
  getAllByMatchup: async (gameID, matchupID: string): Promise<IPrediction[]> => {
    const snap: firebase.firestore.QuerySnapshot = await db.collection("games")
      .doc(gameID)
      .collection("matchups")
      .doc(matchupID)
      .collection("predictions")
      .withConverter(predictionConverter)
      .get();
      
    let predictions: IPrediction[] = [];

    snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IPrediction>) => 
      predictions.push(doc.data()));
      
    return predictions;
  },
  getAllForMatchups: async (gameID: string, matchups: IMatchup[]): Promise<IPrediction[]> => {    
    const requests: any[] = matchups.map((matchup: IMatchup) => PredictionService.getAllByMatchup(gameID, matchup.id)),
      responses: any = await Promise.all(requests);

    return responses.flat();
  },
  onCreate: async (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext): Promise<void> => {
    const prediction: IPrediction = { ...snapshot.data() as IPrediction, id: snapshot.id };

    try {
      const matchupRef: firebase.firestore.DocumentReference<IMatchup> = db.collection("games")
        .doc(context.params.gameID)
        .collection("matchups")
        .doc(context.params.matchupID)
        .withConverter<IMatchup>(matchupConverter);

      await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
        const matchupDoc: firebase.firestore.DocumentSnapshot<IMatchup> = await transaction.get(matchupRef);

        if(matchupDoc.exists) {
          const matchup: IMatchup = matchupDoc.data();

          const property: string = prediction.ref.player === matchup.left.playerID ? "left" : "right",
            side: IMatchupSide = matchup[property];

          transaction.update(matchupRef, { 
            [`${property}.total.participants`]: firebase.firestore.FieldValue.increment(1),
            [`${property}.total.wagered`]: side.total.wagered + prediction.amount
          });

          GameEventTransactionService.create(
            transaction, 
            context.params.gameID, 
            GameEventUtility.mapPlayerCreatedPredictionEvent(
              prediction.ref.creator, 
              prediction.createdAt, 
              prediction.ref.player, 
              MatchupUtility.mapPlayerReference(matchup),
              prediction.amount
            )
          );
        }
      });      
    } catch (err) {
      logger.error(err);
    }
  },
  onUpdate: async (change: Change<firebase.firestore.QueryDocumentSnapshot<IPrediction>>, context: EventContext): Promise<void> => {
    const before: IPrediction = change.before.data(),
      after: IPrediction = change.after.data();

    if(before.amount !== after.amount || (!before.refundedAt && after.refundedAt)) {
      try {
        const matchupRef: firebase.firestore.DocumentReference<IMatchup> = db.collection("games")
          .doc(context.params.gameID)
          .collection("matchups")
          .doc(after.ref.matchup)
          .withConverter<IMatchup>(matchupConverter);

        await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
          const matchupDoc: firebase.firestore.DocumentSnapshot<IMatchup> = await transaction.get(matchupRef);

          if(matchupDoc.exists) {
            const matchup: IMatchup = matchupDoc.data();

            if(!after.refundedAt) {
              const property: string = after.ref.player === matchup.left.playerID
                ? "left"
                : "right";

              const side: IMatchupSide = matchup[property],
                delta: number = after.amount - before.amount,
                updatedTotalWagered: number = side.total.wagered + delta;

              transaction.update(matchupRef, { 
                [`${property}.total.wagered`]: updatedTotalWagered
              });
            }

            const occurredAt: firebase.firestore.FieldValue = after.refundedAt || after.updatedAt;

            GameEventTransactionService.create(
              transaction, 
              context.params.gameID, 
              GameEventUtility.mapPlayerUpdatedPredictionEvent(
                after.ref.creator,
                occurredAt,
                after.ref.player,
                MatchupUtility.mapPlayerReference(matchup),
                before.amount,
                after.amount,
                after.refundedAt
              )
            );
          }
        });
      } catch (err) {
        logger.error(err);
      }
    }
  },
  refundAllOneSidedPredictions: async (gameID: string, summary: IGameDaySummary): Promise<void> => {
    const oneSidedMatchups: IMatchup[] = MatchupUtility.getOneSidedMatchups(summary.matchups);

    if(oneSidedMatchups.length > 0) {
      const oneSidedPredictions: IPrediction[] = await PredictionService.getAllForMatchups(gameID, oneSidedMatchups),
        updatedSummary: IGameDaySummary = GameDaySummaryUtility.resetOneSidedMatchups(summary, oneSidedPredictions);

      await PredictionTransactionService.refundAllPredictions(gameID, updatedSummary, oneSidedMatchups, oneSidedPredictions);
    }
  }
}