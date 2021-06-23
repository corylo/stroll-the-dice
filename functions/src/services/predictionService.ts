import firebase from "firebase-admin";
import { EventContext, logger } from "firebase-functions";

import { db } from "../../firebase";

import { IMatchup } from "../../../stroll-models/matchup";
import { IPlayer } from "../../../stroll-models/player";
import { IPrediction } from "../../../stroll-models/prediction";

interface IPredictionService {  
  onCreate: (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext) => Promise<void>;
}

export const PredictionService: IPredictionService = {
  onCreate: async (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext): Promise<void> => {
    const prediction: IPrediction = { ...snapshot.data() as IPrediction, id: snapshot.id };

    try {
      const playerRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(context.params.gameID)
        .collection("players")
        .doc(context.params.playerID);

      const matchupRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(context.params.gameID)
        .collection("matchups")
        .doc(prediction.ref.matchup);

      await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
        const playerDoc: firebase.firestore.DocumentSnapshot = await transaction.get(playerRef),
          matchupDoc: firebase.firestore.DocumentSnapshot = await transaction.get(matchupRef);

        if(playerDoc.exists && matchupDoc.exists) {
          const player: IPlayer = { ...playerDoc.data() as IPlayer, id: playerDoc.id };          

          transaction.update(playerRef, { funds: player.funds - prediction.amount });

          const matchup: IMatchup = { ...matchupDoc.data() as IMatchup, id: matchupDoc.id };

          const side: string = prediction.ref.player === matchup.left.ref
            ? "left"
            : "right";

          transaction.update(matchupRef, { 
            [`${side}.total.predictions`]: firebase.firestore.FieldValue.increment(1),
            [`${side}.total.wagered`]: matchup[side].total.wagered + prediction.amount
          });
        }
      });
      
      logger.info(`Player [${context.params.playerID}] successfully predicted amount [${prediction.amount}] in game [${context.params.gameID}].`);
    } catch (err) {
      logger.error(err);
    }
  }
}