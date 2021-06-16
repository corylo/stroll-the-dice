import firebase from "firebase/app";

import { db } from "../../../firebase";

import { InviteUtility } from "../../../utilities/inviteUtility";

import { gameConverter, IGame } from "../../../../stroll-models/game";
import { IInvite, inviteConverter } from "../../../../stroll-models/invite";

interface ICreateGameService {
  createGameAndInvite: (game: IGame) => Promise<void>;
}

export const CreateGameService: ICreateGameService = {
  createGameAndInvite: async (game: IGame): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    const gameRef: firebase.firestore.DocumentReference<IGame> = db.collection("games")
      .doc(game.id)
      .withConverter(gameConverter);

    batch.set(gameRef, game);

    const inviteRef: firebase.firestore.DocumentReference<IInvite> = db.collection("invites")
      .doc()
      .withConverter(inviteConverter);

    batch.set(inviteRef, InviteUtility.mapCreate(game, game.creator));

    return await batch.commit();
  }
}