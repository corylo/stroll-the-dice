import firebase from "firebase-admin";
import { logger } from "firebase-functions";

import { db } from "../../../firebase";

import { MatchupUtility } from "../../utilities/matchupUtility";

import { IGame } from "../../../../stroll-models/game";
import { IMatchup, matchupConverter } from "../../../../stroll-models/matchup";
import { IPlayer } from "../../../../stroll-models/player";

interface IPlayerTransactionService {
  handleMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, game: IGame, player: IPlayer) => void;
  completeDayOneMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, player: IPlayer) => void;
  createDayOneMatchup: (transaction: firebase.firestore.Transaction, player: IPlayer) => void;
  createPlayingIn: (transaction: firebase.firestore.Transaction, game: IGame, player: IPlayer) => void;
  updateCounts: (transaction: firebase.firestore.Transaction, gameRef: firebase.firestore.DocumentReference, game: IGame, player: IPlayer) => void;
}

export const PlayerTransactionService: IPlayerTransactionService = {
  handleMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, game: IGame, player: IPlayer): void => {
    if(matchupSnap.empty || game.counts.players % 2 === 0) {
      PlayerTransactionService.createDayOneMatchup(transaction, player);
    } else if (matchupSnap.docs.length === 1) {
      PlayerTransactionService.completeDayOneMatchup(transaction, matchupSnap, player);
    }
  },
  completeDayOneMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, player: IPlayer): void => {      
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
  createDayOneMatchup: (transaction: firebase.firestore.Transaction, player: IPlayer): void => {
    logger.info(`Creating matchup for player [${player.id}] in game [${player.ref.game}].`);

    const matchupRef: firebase.firestore.DocumentReference = db.collection("games")
      .doc(player.ref.game)
      .collection("matchups")
      .withConverter<IMatchup>(matchupConverter)
      .doc();

    transaction.set(matchupRef, MatchupUtility.mapCreate(player.id, "", 1));
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