import firebase from "firebase/app";

import { db } from "../config/firebase";

import { ProfileService } from "./profileService";

import { ErrorUtility } from "../utilities/errorUtility";

import { IGame } from "../../stroll-models/game";
import { IPlayer, playerConverter } from "../../stroll-models/player";
import { IProfile } from "../../stroll-models/profile";

import { DocumentType } from "../../stroll-enums/documentType";

interface IPlayerServiceGetBy {
  id: (gameID: string, id: string) => Promise<IPlayer>;  
}

interface IPlayerServiceGet {
  by: IPlayerServiceGetBy;
}

interface IPlayerService {
  create: (game: IGame, player: IPlayer) => Promise<void>;
  get: IPlayerServiceGet;
  getProfiles: (players: IPlayer[]) => Promise<IPlayer[]>;
}

export const PlayerService: IPlayerService = {
  create: async (game: IGame, player: IPlayer): Promise<void> => {
    return await db.collection("games")      
      .doc(game.id)
      .collection("players")
      .doc(player.id)
      .withConverter(playerConverter)
      .set(player);
  },
  get: {
    by: {
      id: async (gameID: string, id: string): Promise<IPlayer> => {
        try {
          const doc: firebase.firestore.DocumentSnapshot<IPlayer> = await db.collection("games")
            .doc(gameID)
            .collection("players")
            .doc(id)
            .withConverter<IPlayer>(playerConverter)
            .get();

          if(doc.exists) {
            return doc.data();
          } else {            
            throw new Error(ErrorUtility.doesNotExist(DocumentType.Player));
          }
        } catch (err) {
          return null; 
        }
      }
    }
  },
  getProfiles: async (players: IPlayer[]): Promise<IPlayer[]> => {
    const profiles: IProfile[] = await ProfileService.getAllByUIDIndividually(players.map((player: IPlayer) => player.id));

    return players.map((player: IPlayer) => {
      const match: IProfile = profiles.find((profile: IProfile) => profile.uid === player.id);

      if(match) {
        player.profile = match;
      }

      return player;
    });
  }
}