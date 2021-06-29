import firebase from "firebase-admin";
import { Change, EventContext, logger } from "firebase-functions";

import { db } from "../../firebase";

import { IMatchup, IMatchupSide } from "../../../stroll-models/matchup";
import { IPrediction, predictionConverter } from "../../../stroll-models/prediction";

interface IPredictionService {  
  getAllByMatchup: (gameID: string, matchupID: string) => Promise<IPrediction[]>;
  getAllForMatchups: (gameID: string, matchups: IMatchup[]) => Promise<IPrediction[]>;
  onCreate: (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext) => Promise<void>;
  onUpdate: (change: Change<firebase.firestore.QueryDocumentSnapshot<IPrediction>>, context: EventContext) => Promise<void>;
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
    let predictions: IPrediction[] = [];

    for(let matchup of matchups) {
      const fetched: IPrediction[] = await PredictionService.getAllByMatchup(gameID, matchup.id);

      predictions = [...predictions, ...fetched];
    }

    return predictions;
  },
  onCreate: async (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext): Promise<void> => {
    const prediction: IPrediction = { ...snapshot.data() as IPrediction, id: snapshot.id };

    try {
      const matchupRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(context.params.gameID)
        .collection("matchups")
        .doc(prediction.ref.matchup);

      await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
        const matchupDoc: firebase.firestore.DocumentSnapshot = await transaction.get(matchupRef);

        if(matchupDoc.exists) {
          const matchup: IMatchup = { ...matchupDoc.data() as IMatchup, id: matchupDoc.id };

          const property: string = prediction.ref.player === matchup.left.ref
            ? "left"
            : "right";

          const side: IMatchupSide = matchup[property];

          const updatedTotalWagered: number = side.total.wagered + prediction.amount;

          transaction.update(matchupRef, { 
            [`${property}.total.participants`]: firebase.firestore.FieldValue.increment(1),
            [`${property}.total.wagered`]: side.total.wagered + prediction.amount
          });
          
          logger.info(`Updated total wagered to [${updatedTotalWagered}] and total participants to [${side.total.participants + 1}]`);
        }
      });
      
    } catch (err) {
      logger.error(err);
    }
  },
  onUpdate: async (change: Change<firebase.firestore.QueryDocumentSnapshot<IPrediction>>, context: EventContext): Promise<void> => {
    const before: IPrediction = change.before.data(),
      after: IPrediction = change.after.data();

    if(before.amount !== after.amount) {
      try {
        const matchupRef: firebase.firestore.DocumentReference = db.collection("games")
          .doc(context.params.gameID)
          .collection("matchups")
          .doc(after.ref.matchup);

        await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
          const matchupDoc: firebase.firestore.DocumentSnapshot = await transaction.get(matchupRef);

          if(matchupDoc.exists) {
            const matchup: IMatchup = { ...matchupDoc.data() as IMatchup, id: matchupDoc.id };

            const property: string = after.ref.player === matchup.left.ref
              ? "left"
              : "right";

            const side: IMatchupSide = matchup[property],
              delta: number = after.amount - before.amount,
              updatedTotalWagered: number = side.total.wagered + delta;

            transaction.update(matchupRef, { 
              [`${property}.total.wagered`]: updatedTotalWagered
            });

            logger.info(`Updated total wagered to [${updatedTotalWagered}]`);
          }
        });
      } catch (err) {
        logger.error(err);
      }
    }
  }
}