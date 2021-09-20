import firebase from "firebase-admin";

import { db } from "../../../config/firebase";

import { IPlayer } from "../../../../stroll-models/player";

import { GameStatus } from "../../../../stroll-enums/gameStatus";

interface IPlayerBatchService {
  updateGameStatus: (batch: firebase.firestore.WriteBatch, players: IPlayer[], gameStatus: GameStatus) => void;
}

export const PlayerBatchService: IPlayerBatchService = {
  updateGameStatus: (batch: firebase.firestore.WriteBatch, players: IPlayer[], gameStatus: GameStatus): void => {
    players.forEach((player: IPlayer) => {      
      const playerRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(player.ref.game)
        .collection("players")
        .doc(player.id);

      batch.update(playerRef, { ["ref.gameStatus"]: gameStatus });
    });
  }
}