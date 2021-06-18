
import firebase from "firebase-admin";
import { Change, EventContext, logger } from "firebase-functions";

import { db } from "../../firebase";

import { PlayingInService } from "./playingInService";

import { GameUtility } from "../utilities/gameUtility";
import { ProfileUtility } from "../utilities/profileUtility";

import { IGame } from "../../../stroll-models/game";
import { IProfileUpdate } from "../../../stroll-models/profileUpdate";

interface IGameServiceBatch {
  update: (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate) => Promise<firebase.firestore.WriteBatch>;
}

interface IGameService {
  batch: IGameServiceBatch;
  onUpdate: (change: Change<firebase.firestore.QueryDocumentSnapshot<IGame>>, context: EventContext) => Promise<void>;
}

export const GameService: IGameService = {
  batch: {
    update: async (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate): Promise<firebase.firestore.WriteBatch> => {    
      const gameSnap: firebase.firestore.QuerySnapshot = await db.collection("games")
        .where("creator.uid", "==", uid)
        .get();

      gameSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {
        const game: IGame = doc.data();

        batch.update(doc.ref, { creator: ProfileUtility.applyUpdate(game.creator, update) });
      });

      return batch;
    }
  },
  onUpdate: async (change: Change<firebase.firestore.QueryDocumentSnapshot<IGame>>, context: EventContext): Promise<void> => {
    const before: IGame = change.before.data(),
      after: IGame = change.after.data();
  
    if(GameUtility.hasChanged(before, after)) {
      logger.info(`Updating all references to game [${after.id}]`);
      
      try {
        const batch: firebase.firestore.WriteBatch = db.batch();
  
        await PlayingInService.batch.update(batch, context.params.id, after);

        const results: firebase.firestore.WriteResult[] = await batch.commit();
  
        logger.info(`Successfully updated ${results.length} documents.`);
      } catch (err) {
        logger.error(err);
      }
    }
  },
}