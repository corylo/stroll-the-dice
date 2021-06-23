import firebase from "firebase-admin";
import { EventContext, logger } from "firebase-functions";

import { db } from "../../firebase";

import { MatchupUtility } from "../utilities/matchupUtility";
import { ProfileUtility } from "../utilities/profileUtility";

import { IGame } from "../../../stroll-models/game";
import { IMatchup, matchupConverter } from "../../../stroll-models/matchup";
import { IPlayer } from "../../../stroll-models/player";
import { IProfileUpdate } from "../../../stroll-models/profileUpdate";

interface IPlayerServiceBatch {
  update: (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate) => Promise<firebase.firestore.WriteBatch>;
}

interface IPlayerServiceTransaction {
  handleMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, game: IGame, player: IPlayer) => void;
  completeMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, player: IPlayer) => void;
  createMatchup: (transaction: firebase.firestore.Transaction, player: IPlayer) => void;
  createPlayingIn: (transaction: firebase.firestore.Transaction, game: IGame, player: IPlayer) => void;
  updateCounts: (transaction: firebase.firestore.Transaction, gameRef: firebase.firestore.DocumentReference, game: IGame, player: IPlayer) => void;
}

interface IPlayerService {
  batch: IPlayerServiceBatch;
  onCreate: (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext) => Promise<void>;
  transaction: IPlayerServiceTransaction;
}

export const PlayerService: IPlayerService = {
  batch: {
    update: async (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate): Promise<firebase.firestore.WriteBatch> => {    
      const playerSnap: firebase.firestore.QuerySnapshot = await db.collectionGroup("players")
        .where("profile.uid", "==", uid)
        .get();

      playerSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IPlayer>) => {
        const player: IPlayer = doc.data();

        batch.update(doc.ref, { profile: ProfileUtility.applyUpdate(player.profile, update) });
      });

      return batch;
    }
  },
  onCreate: async (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext): Promise<void> => {
    const player: IPlayer = { ...snapshot.data() as IPlayer, id: snapshot.id };

    try {
      const gameRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(player.ref.game);

      const existingMatchupRef: firebase.firestore.Query = db.collection("games")
        .doc(player.ref.game)
        .collection("matchups")
        .orderBy("createdAt", "desc")
        .limit(1)
        .withConverter(matchupConverter);

      await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
        const gameDoc: firebase.firestore.DocumentSnapshot = await transaction.get(gameRef),
          matchupSnap: firebase.firestore.QuerySnapshot = await transaction.get(existingMatchupRef);

        if(gameDoc.exists) {
          const game: IGame = { ...gameDoc.data() as IGame, id: gameDoc.id }; 

          PlayerService.transaction.updateCounts(transaction, gameRef, game, player);
        
          PlayerService.transaction.createPlayingIn(transaction, game, player);

          PlayerService.transaction.handleMatchup(transaction, matchupSnap, game, player);
        }
      });
      
      logger.info(`Successfully completed onCreate function for player [${player.id}] in game [${player.ref.game}].`);
    } catch (err) {
      logger.error(err);
    }
  },
  transaction: {
    handleMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, game: IGame, player: IPlayer): void => {
      if(matchupSnap.empty || game.counts.players % 2 === 0) {
        PlayerService.transaction.createMatchup(transaction, player);
      } else if (matchupSnap.docs.length === 1) {
        PlayerService.transaction.completeMatchup(transaction, matchupSnap, player);
      }
    },
    completeMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, player: IPlayer): void => {      
      const matchups: IMatchup[] = [];

      matchupSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IMatchup>) => 
        matchups.push({ ...doc.data(), id: doc.id }));

      const matchup: IMatchup = matchups[0];

      logger.info(`Completing matchup [${matchup.id}] for player [${player.id}] in game [${player.ref.game}].`);

      const matchupRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(player.ref.game)
        .collection("matchups")
        .withConverter<IMatchup>(matchupConverter)
        .doc(matchup.id);

      transaction.update(matchupRef, { ["right.ref"]: player.id });
    },
    createMatchup: (transaction: firebase.firestore.Transaction, player: IPlayer): void => {
      logger.info(`Creating matchup for player [${player.id}] in game [${player.ref.game}].`);

      const matchupRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(player.ref.game)
        .collection("matchups")
        .withConverter<IMatchup>(matchupConverter)
        .doc();

      transaction.set(matchupRef, MatchupUtility.mapCreate(player));
    },
    createPlayingIn: (transaction: firebase.firestore.Transaction, game: IGame, player: IPlayer): void => {
      const playingInRef: firebase.firestore.DocumentReference = db.collection("profiles")
            .doc(player.id)
            .collection("playing_in")
            .doc(player.ref.game);

      transaction.set(playingInRef, { name: game.name.toLowerCase(), id: game.id, startsAt: game.startsAt });
    },
    updateCounts: (transaction: firebase.firestore.Transaction, gameRef: firebase.firestore.DocumentReference, game: IGame, player: IPlayer): void => {      
      if(player.id !== game.creator.uid) { 
        transaction.update(gameRef, { ["counts.players"]: firebase.firestore.FieldValue.increment(1) });

        const inviteRef: firebase.firestore.DocumentReference = db.collection("games")
          .doc(player.ref.game)
          .collection("invites")
          .doc(player.ref.invite);
          
        transaction.update(inviteRef, { ["uses.current"]: firebase.firestore.FieldValue.increment(1) });
      }
    }
  }
}