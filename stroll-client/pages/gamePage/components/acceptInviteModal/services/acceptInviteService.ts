import firebase from "firebase/app";

import { db } from "../../../../../firebase";

import { PlayerUtility } from "../../../../../utilities/playerUtility";

import { IGame } from "../../../../../../stroll-models/game";
import { IInvite } from "../../../../../../stroll-models/invite";
import { IPlayer, playerConverter } from "../../../../../../stroll-models/player";
import { IProfile } from "../../../../../../stroll-models/profile";

interface IAcceptInviteService {
  acceptInvite: (game: IGame, profile: IProfile, invite: IInvite) => Promise<void>;
}

export const AcceptInviteService: IAcceptInviteService = {
  acceptInvite: async (game: IGame, profile: IProfile, invite: IInvite): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    const player: IPlayer = PlayerUtility.mapCreate(profile, game, invite);

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