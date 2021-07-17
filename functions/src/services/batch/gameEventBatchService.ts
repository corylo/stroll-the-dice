import firebase from "firebase-admin";
import { logger } from "firebase-functions";

import { db } from "../../../firebase";

import { GameEventUtility } from "../../utilities/gameEventUtility";

import { gameEventConverter, IGameEvent } from "../../../../stroll-models/gameEvent/gameEvent";
import { IProfileReference } from "../../../../stroll-models/profileReference";

import { GameEventType } from "../../../../stroll-enums/gameEventType";

interface IGameEventBatchService {
  create: (batch: firebase.firestore.WriteBatch, gameID: string, event: IGameEvent) => void;    
  updatePlayerProfileInPredictionCreatedEvents: (gameID: string, playerID: string, profile: IProfileReference) => Promise<void>;
  updatePlayerProfileInPredictionEvents: (gameID: string, playerID: string, profile: IProfileReference) => Promise<void>;
  updatePlayerProfileInPredictionUpdatedEvents: (gameID: string, playerID: string, profile: IProfileReference) => Promise<void>;
  updatePlayerProfileInPredictionUpdatedEventsLoop: (docs: FirebaseFirestore.QueryDocumentSnapshot[], property: string, profile: IProfileReference) => Promise<void>;
}

export const GameEventBatchService: IGameEventBatchService = {
  create: (batch: firebase.firestore.WriteBatch, gameID: string, event: IGameEvent): void => {
    const eventRef: firebase.firestore.DocumentReference = db.collection("games")      
      .doc(gameID)
      .collection("events")
      .withConverter(gameEventConverter)
      .doc();

    batch.create(eventRef, event);
  },
  updatePlayerProfileInPredictionCreatedEvents: async (gameID: string, playerID: string, profile: IProfileReference): Promise<void> => {
    const predictionCreatedMatchupLeftSnap: firebase.firestore.QuerySnapshot = 
      await GameEventUtility
        .getPredictionMatchupQuery(gameID, playerID, GameEventType.PlayerCreated, "left.profile.uid")
        .get();
    
    const predictionCreatedMatchupRightSnap: firebase.firestore.QuerySnapshot = 
      await GameEventUtility
        .getPredictionMatchupQuery(gameID, playerID, GameEventType.PlayerCreated, "right.profile.uid")
        .get();

    const batch: firebase.firestore.WriteBatch = db.batch();

    predictionCreatedMatchupLeftSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGameEvent>) =>      
      batch.update(doc.ref, { ["matchup.left"]: profile }));

    predictionCreatedMatchupRightSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGameEvent>) =>    
      batch.update(doc.ref, { ["matchup.right"]: profile }));

    await batch.commit();
  },
  updatePlayerProfileInPredictionEvents: async (gameID: string, playerID: string, profile: IProfileReference): Promise<void> => {
    await GameEventBatchService.updatePlayerProfileInPredictionCreatedEvents(gameID, playerID, profile);
    
    await GameEventBatchService.updatePlayerProfileInPredictionUpdatedEvents(gameID, playerID, profile);
  },
  updatePlayerProfileInPredictionUpdatedEvents: async (gameID: string, playerID: string, profile: IProfileReference): Promise<void> => {
    const predictionUpdatedMatchupLeftSnap: firebase.firestore.QuerySnapshot = 
      await GameEventUtility
        .getPredictionMatchupQuery(gameID, playerID, GameEventType.PlayerUpdatedPrediction, "matchup.left.uid")
        .get();

    if(!predictionUpdatedMatchupLeftSnap.empty) {
      let loopIndex: number = 1;

      for(let i: number = 0; i < predictionUpdatedMatchupLeftSnap.docs.length; i += 500) {
        const min: number = i,
          max: number = i + 500,
          adjustedMax: number = Math.min(max, predictionUpdatedMatchupLeftSnap.docs.length);

        logger.info(`Loop [${loopIndex++}]: Updating [matchup left] profile of player [${playerID}] in [${GameEventType.PlayerUpdatedPrediction}] events [${min + 1} - ${adjustedMax}].`);

        await GameEventBatchService.updatePlayerProfileInPredictionUpdatedEventsLoop(
          predictionUpdatedMatchupLeftSnap.docs.slice(min, max), 
          "matchup.left", 
          profile
        );      
      }
    }
    
    const predictionUpdatedMatchupRightSnap: firebase.firestore.QuerySnapshot =
      await GameEventUtility
        .getPredictionMatchupQuery(gameID, playerID, GameEventType.PlayerUpdatedPrediction, "matchup.right.uid")
        .get();
        
    if(!predictionUpdatedMatchupRightSnap.empty) {
      let loopIndex: number = 1;

      for(let i: number = 0; i < predictionUpdatedMatchupRightSnap.docs.length; i += 500) {
        const min: number = i,
          max: number = i + 500,
          adjustedMax: number = Math.min(max, predictionUpdatedMatchupRightSnap.docs.length);

        logger.info(`Loop [${loopIndex++}]: Updating [matchup right] profile of player [${playerID}] in [${GameEventType.PlayerUpdatedPrediction}] events [${min + 1} - ${adjustedMax}].`);

        await GameEventBatchService.updatePlayerProfileInPredictionUpdatedEventsLoop(
          predictionUpdatedMatchupRightSnap.docs.slice(min, max), 
          "matchup.right", 
          profile
        );      
      }    
    }
  },
  updatePlayerProfileInPredictionUpdatedEventsLoop: async (docs: FirebaseFirestore.QueryDocumentSnapshot[], property: string, profile: IProfileReference): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGameEvent>) => 
      batch.update(doc.ref, { [property]: profile }));

    await batch.commit();
  }
}