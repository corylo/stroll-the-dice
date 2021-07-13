import firebase from "firebase/app";

import { db } from "../../../../../firebase";

import { IGame } from "../../../../../../stroll-models/game";
import { IPlayer, playerConverter } from "../../../../../../stroll-models/player";

interface IAcceptInviteService {
  acceptInvite: (game: IGame, player: IPlayer) => Promise<void>;
}

export const AcceptInviteService: IAcceptInviteService = {
  acceptInvite: async (game: IGame, player: IPlayer): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    const playerRef: firebase.firestore.DocumentReference = db.collection("games")      
      .doc(game.id)
      .collection("players")
      .doc(player.id)
      .withConverter(playerConverter);

    batch.set(playerRef, player)

    const playingInRef: firebase.firestore.DocumentReference = db.collection("profiles")
          .doc(player.id)
          .collection("playing_in")
          .doc(player.ref.game);

    batch.set(playingInRef, { 
      id: game.id,
      name: game.name.toLowerCase(), 
      startsAt: game.startsAt,
      status: game.status,
      endsAt: game.endsAt
    });

    return await batch.commit();
  }
}