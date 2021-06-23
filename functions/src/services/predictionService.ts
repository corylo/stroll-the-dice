import firebase from "firebase-admin";
import { Change, EventContext, logger } from "firebase-functions";

import { db } from "../../firebase";

import { IMatchup } from "../../../stroll-models/matchup";
import { IPlayer } from "../../../stroll-models/player";
import { IPrediction } from "../../../stroll-models/prediction";

interface IPredictionService {  
  onCreate: (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext) => Promise<void>;
  onUpdate: (change: Change<firebase.firestore.QueryDocumentSnapshot<IPrediction>>, context: EventContext) => Promise<void>;
}

export const PredictionService: IPredictionService = {
  onCreate: async (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext): Promise<void> => {
    const prediction: IPrediction = { ...snapshot.data() as IPrediction, id: snapshot.id };

    try {
      const playerRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(context.params.gameID)
        .collection("players")
        .doc(prediction.ref.creator);

      const matchupRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(context.params.gameID)
        .collection("matchups")
        .doc(prediction.ref.matchup);

      await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
        const playerDoc: firebase.firestore.DocumentSnapshot = await transaction.get(playerRef),
          matchupDoc: firebase.firestore.DocumentSnapshot = await transaction.get(matchupRef);

        if(playerDoc.exists && matchupDoc.exists) {
          const player: IPlayer = { ...playerDoc.data() as IPlayer, id: playerDoc.id };          

          const updatedFunds: number = player.funds - prediction.amount;

          transaction.update(playerRef, { 
            funds: player.funds - prediction.amount,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp() 
          });

          const matchup: IMatchup = { ...matchupDoc.data() as IMatchup, id: matchupDoc.id };

          const side: string = prediction.ref.player === matchup.left.ref
            ? "left"
            : "right";

          const updatedTotalWagered: number = matchup[side].total.wagered + prediction.amount;

          transaction.update(matchupRef, { 
            [`${side}.total.predictions`]: firebase.firestore.FieldValue.increment(1),
            [`${side}.total.wagered`]: matchup[side].total.wagered + prediction.amount
          });
          
          logger.info(`Updated funds for player [${prediction.ref.creator}] to [${updatedFunds}] and total wagered to [${updatedTotalWagered}]`);
        }
      });
      
    } catch (err) {
      logger.error(err);
    }
  },
  onUpdate: async (change: Change<firebase.firestore.QueryDocumentSnapshot<IPrediction>>, context: EventContext): Promise<void> => {
    const before: IPrediction = change.before.data(),
      after: IPrediction = change.after.data();

    const delta: number = after.amount - before.amount;

    if(before.amount !== after.amount) {
      try {
        const playerRef: firebase.firestore.DocumentReference = db.collection("games")
          .doc(context.params.gameID)
          .collection("players")
          .doc(after.ref.creator);
        
        const matchupRef: firebase.firestore.DocumentReference = db.collection("games")
          .doc(context.params.gameID)
          .collection("matchups")
          .doc(after.ref.matchup);

        await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
          const playerDoc: firebase.firestore.DocumentSnapshot = await transaction.get(playerRef),
            matchupDoc: firebase.firestore.DocumentSnapshot = await transaction.get(matchupRef);

          if(playerDoc.exists && matchupDoc.exists) {
            const player: IPlayer = { ...playerDoc.data() as IPlayer, id: playerDoc.id };          

            if(delta <= player.funds) {
              const updatedFunds: number = player.funds - delta;

              transaction.update(playerRef, { 
                funds: updatedFunds, 
                updatedAt: firebase.firestore.FieldValue.serverTimestamp() 
              });

              const matchup: IMatchup = { ...matchupDoc.data() as IMatchup, id: matchupDoc.id };

              const side: string = after.ref.player === matchup.left.ref
                ? "left"
                : "right";

              const updatedTotalWagered: number = matchup[side].total.wagered + delta;

              transaction.update(matchupRef, { 
                [`${side}.total.wagered`]: updatedTotalWagered
              });

              logger.info(`Updated funds for player [${after.ref.creator}] to [${updatedFunds}] and total wagered to [${updatedTotalWagered}]`);
            }
          }
        });
      } catch (err) {
        logger.error(err);
      }
    }
  }
}