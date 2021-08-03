import firebase from "firebase-admin";

import { db } from "../../../config/firebase";

import { gameEventConverter, IGameEvent } from "../../../../stroll-models/gameEvent/gameEvent";
import { IMatchup, matchupConverter } from "../../../../stroll-models/matchup";
import { IProfileReference } from "../../../../stroll-models/profileReference";

import { GameEventType } from "../../../../stroll-enums/gameEventType";

interface IGameEventTransactionService {
  create: (transaction: firebase.firestore.Transaction, gameID: string, event: IGameEvent) => void;  
  updatePlayerProfileInMatchupsAndPlayerCreatedEvents: (gameID: string, playerID: string, profile: IProfileReference) => Promise<void>;
}

export const GameEventTransactionService: IGameEventTransactionService = {
  create: (transaction: firebase.firestore.Transaction, gameID: string, event: IGameEvent): void => {
    const eventRef: firebase.firestore.DocumentReference = db.collection("games")      
      .doc(gameID)
      .collection("events")
      .withConverter(gameEventConverter)
      .doc();

    transaction.create(eventRef, event);
  },
  updatePlayerProfileInMatchupsAndPlayerCreatedEvents: async (gameID: string, playerID: string, profile: IProfileReference): Promise<void> => {
    await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
      const matchupRef: firebase.firestore.Query = db.collection("games")
        .doc(gameID)
        .collection("matchups")
        .withConverter<IMatchup>(matchupConverter);

      const playerCreatedEventsRef: firebase.firestore.Query = db.collection("games")
        .doc(gameID)
        .collection("events") 
        .where("type", "==", GameEventType.PlayerCreated)
        .where("profile.uid", "==", playerID)    
        .withConverter(gameEventConverter);

      const matchupSnap: firebase.firestore.QuerySnapshot = await transaction.get(matchupRef),
        playerCreatedEventsSnap: firebase.firestore.QuerySnapshot = await transaction.get(playerCreatedEventsRef);

      if(!matchupSnap.empty) {
        matchupSnap.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IMatchup>) => {
          const matchup: IMatchup = doc.data();

          if(matchup.left.profile.uid === playerID) {
            transaction.update(doc.ref, { ["left.profile"]: profile });
          } else if (matchup.right.profile.uid === playerID) {
            transaction.update(doc.ref, { ["right.profile"]: profile });
          }
        });
      }

      if(!playerCreatedEventsSnap.empty) {   
        playerCreatedEventsSnap.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGameEvent>) => 
          transaction.update(doc.ref, { profile }));
      }
    });
  }
}