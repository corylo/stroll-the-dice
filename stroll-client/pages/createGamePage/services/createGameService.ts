import firebase from "firebase/app";

import { db } from "../../../firebase";

import { InviteUtility } from "../../../utilities/inviteUtility";
import { PlayerUtility } from "../../../utilities/playerUtility";

import { gameConverter, IGame } from "../../../../stroll-models/game";
import { IInvite, inviteConverter } from "../../../../stroll-models/invite";
import { IPlayer, playerConverter } from "../../../../stroll-models/player";

interface ICreateGameService {
  createGame: (game: IGame) => Promise<void>;
}

export const CreateGameService: ICreateGameService = {
  createGame: async (game: IGame): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    const invite: IInvite = InviteUtility.mapCreate(game.creator.uid),
      player: IPlayer = PlayerUtility.mapCreate(game.creator, game, invite);

    const gameRef: firebase.firestore.DocumentReference<IGame> = db.collection("games")
      .doc(game.id)
      .withConverter(gameConverter);

    batch.set(gameRef, game);

    const inviteRef: firebase.firestore.DocumentReference<IInvite> = db
      .collection("games")
      .doc(game.id)
      .collection("invites")
      .doc(invite.id)
      .withConverter(inviteConverter);

    batch.set(inviteRef, invite);

    const playerRef: firebase.firestore.DocumentReference = db.collection("games")
      .doc(game.id)
      .collection("players")
      .doc(game.creator.uid)
      .withConverter(playerConverter);

    batch.set(playerRef, player);

    return await batch.commit();
  }
}