import firebase from "firebase/app";

import { db } from "../config/firebase";

import { ErrorUtility } from "../utilities/errorUtility";

import { IGame } from "../../stroll-models/game";
import { IPlayer, playerConverter } from "../../stroll-models/player";

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
  }
}