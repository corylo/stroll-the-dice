import firebase from "firebase-admin";
import _orderBy from "lodash.orderby";

import { db } from "../../config/firebase";

import { GameDaySummaryUtility } from "./gameDaySummaryUtility";
import { PointsUtility } from "./pointsUtility";

import { IPlayer, playerConverter } from "../../../stroll-models/player";
import { IPlayerStepUpdate } from "../../../stroll-models/playerStepUpdate";
import { IMatchup } from "../../../stroll-models/matchup";
import { IPrediction } from "../../../stroll-models/prediction";

interface IPlayerUtility {
  getPlayersRef: (gameID: string) => firebase.firestore.Query;  
  hasProfileChanged: (before: IPlayer, after: IPlayer) => boolean;
  mapPlayerEarnedPointsAtEndOfDayUpdates: (players: IPlayer[], day: number, matchups: IMatchup[], predictions: IPrediction[]) => IPlayer[];
  mapPlayerEarnedPointsForStepsUpdates: (playerSnap: firebase.firestore.QuerySnapshot, updates: IPlayerStepUpdate[]) => IPlayer[];
  mapPlaces: (players: IPlayer[]) => IPlayer[];
}

export const PlayerUtility: IPlayerUtility = {
  getPlayersRef: (gameID: string): firebase.firestore.Query => {
    return  db.collection("games")
      .doc(gameID)
      .collection("players")
      .withConverter(playerConverter);
  },
  hasProfileChanged: (before: IPlayer, after: IPlayer): boolean => {
    return (
      before.profile.color !== after.profile.color ||
      before.profile.icon !== after.profile.icon ||
      before.profile.name !== after.profile.name ||
      before.profile.username !== after.profile.username
    )
  },
  mapPlayerEarnedPointsAtEndOfDayUpdates: (players: IPlayer[], day: number, matchups: IMatchup[], predictions: IPrediction[]): IPlayer[] => {    
    return PlayerUtility.mapPlaces(players.map((player: IPlayer) => {            
      player.points = PointsUtility.mapEndOfDayPoints(player, GameDaySummaryUtility.mapPlayerDayCompletedSummary(
        day, 
        player.id, 
        0,
        matchups, 
        predictions
      ));

      return player;
    }));
  },
  mapPlayerEarnedPointsForStepsUpdates: (playerSnap: firebase.firestore.QuerySnapshot, updates: IPlayerStepUpdate[]): IPlayer[] => {
    let players: IPlayer[] = [];

    playerSnap.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IPlayer>) => {
      const player: IPlayer = doc.data(),
        steps: number = GameDaySummaryUtility.findUpdateForPlayer(doc.id, updates);

      if(steps > 0) {
        player.steps = player.steps + steps;
        player.points = PointsUtility.mapPointsForSteps(player, steps);
      }

      players.push(player);
    });

    return PlayerUtility.mapPlaces(players);
  },
  mapPlaces: (players: IPlayer[]): IPlayer[] => {
    return _orderBy(players, ["points.total", "createdAt"], ["desc", "asc"])
      .map((player: IPlayer, index: number) => ({ ...player, place: index + 1 }));
  }
}