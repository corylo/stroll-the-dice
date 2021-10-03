import firebase from "firebase/app";

import { db } from "../../../../../config/firebase";

import { gameConverter, IGame } from "../../../../../../stroll-models/game";
import { inviteConverter } from "../../../../../../stroll-models/invite";
import { IPlayer, playerConverter } from "../../../../../../stroll-models/player";

import { ProfileStatsID } from "../../../../../../stroll-enums/profileStatsID";

interface IAcceptInviteService {
  acceptInvite: (game: IGame, player: IPlayer) => Promise<void>;
}

export const AcceptInviteService: IAcceptInviteService = {
  acceptInvite: async (game: IGame, player: IPlayer): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    const gameRef: firebase.firestore.DocumentReference = db.collection("games")      
      .doc(game.id)
      .withConverter(gameConverter);

    batch.update(gameRef, { ["counts.players"]: firebase.firestore.FieldValue.increment(1) });

    const playerRef: firebase.firestore.DocumentReference = db.collection("games")      
      .doc(game.id)
      .collection("players")
      .doc(player.id)
      .withConverter(playerConverter);

    batch.set(playerRef, player);

    const inviteRef: firebase.firestore.DocumentReference = db.collection("games")      
      .doc(game.id)
      .collection("invites")
      .doc(player.ref.invite)
      .withConverter(inviteConverter);

    batch.update(inviteRef, { 
      ["uses.current"]: firebase.firestore.FieldValue.increment(1),
      lastUsedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    const playingInRef: firebase.firestore.DocumentReference = db.collection("profiles")
      .doc(player.id)
      .collection("playing_in")
      .doc(game.id);

    batch.set(playingInRef, { 
      id: game.id,
      name: game.name.toLowerCase(), 
      startsAt: game.startsAt,
      status: game.status,
      endsAt: game.endsAt
    });

    const gamesStatsRef: firebase.firestore.DocumentReference = db.collection("profiles")      
      .doc(player.id)
      .collection("stats")
      .doc(ProfileStatsID.Games);

    batch.update(gamesStatsRef, { lastJoined: game.id });
    
    await batch.commit();
  }
}