import firebase from "firebase/app";

import { db } from "../../../config/firebase";

import { gameConverter, IGame } from "../../../../stroll-models/game";
import { IInvite, inviteConverter } from "../../../../stroll-models/invite";
import { IPlayer, playerConverter } from "../../../../stroll-models/player";

import { ProfileStatsID } from "../../../../stroll-enums/profileStatsID";

interface ICreateGameService {
  createGame: (game: IGame, player: IPlayer, invite: IInvite) => Promise<void>;
}

export const CreateGameService: ICreateGameService = {
  createGame: async (game: IGame, player: IPlayer, invite: IInvite): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    const gameRef: firebase.firestore.DocumentReference<IGame> = db.collection("games")
      .doc(game.id)
      .withConverter<IGame>(gameConverter);

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
      .doc(game.creatorUID)
      .withConverter(playerConverter);

    batch.set(playerRef, player);  
    
    const gamesStatsRef: firebase.firestore.DocumentReference = db.collection("profiles")      
      .doc(game.creatorUID)
      .collection("stats")
      .doc(ProfileStatsID.Games);

    batch.update(gamesStatsRef, { lastCreated: game.id });

    return await batch.commit();
  }
}