import { useEffect, useState } from "react";
import firebase from "firebase/app";

import { db } from "../../../firebase";

import { MatchupUtility } from "../../../utilities/matchupUtility";
import { PlayerUtility } from "../../../utilities/playerUtility";

import { IAppState } from "../../../components/app/models/appState";
import { defaultGame, gameConverter, IGame } from "../../../../stroll-models/game";
import { IGamePageState } from "../models/gamePageState";
import { IMatchup, matchupConverter } from "../../../../stroll-models/matchup";
import { IPrediction, predictionConverter } from "../../../../stroll-models/prediction";
import { IPlayer, playerConverter } from "../../../../stroll-models/player";

export const useGameListenersEffect = (appState: IAppState, state: IGamePageState, setState: (state: IGamePageState) => void): void => {
  const [game, setGame] = useState<IGame>(defaultGame()),
    [players, setPlayers] = useState<IPlayer[]>([]),
    [matchups, setMatchups] = useState<IMatchup[]>([]),
    [predictions, setPredictions] = useState<IPrediction[]>([]);

  useEffect(() => {    
    const updates: IGamePageState = { ...state };

    if(game.id !== "") {
      updates.game = game;
    }

    const player: IPlayer = PlayerUtility.getByUser(appState.user, players);

    console.log("doin updates", players, player)

    if(player) {
      updates.player = player;
    }

    if(matchups.length > 0) {
      updates.matchups = MatchupUtility.mapPlayers(matchups, players);
    }

    if(players.length > 0) {
      updates.players = players;
    }

    if(predictions.length > 0) {
      updates.predictions = predictions;
    }

    setState(updates);
  }, [appState.user, game, matchups, players, predictions]);

  useEffect(() => {        
    if(state.game.id !== "" && state.player.id !== "") {      
      console.log("listening", state.player)
      const unsubToGame = db.collection("games")
        .doc(state.game.id)
        .withConverter(gameConverter)
        .onSnapshot((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {
          if(doc.exists) {
            setGame(doc.data());
          }
        });

      const unsubToPlayers = db.collection("games")
        .doc(state.game.id)
        .collection("players")
        .orderBy("profile.username")
        .withConverter(playerConverter)
        .onSnapshot((snap: firebase.firestore.QuerySnapshot) => {
          let updates: IPlayer[] = [];

          snap.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IPlayer>) =>
            updates.push(doc.data()));
          
          setPlayers(updates);
        });

      const unsubToMatchups = db.collection("games")
        .doc(state.game.id)
        .collection("matchups")
        .where("day", "<=", state.day + 1)
        .orderBy("day", "desc")
        .orderBy("createdAt")
        .withConverter(matchupConverter)
        .onSnapshot((snap: firebase.firestore.QuerySnapshot) => {
          let updates: IMatchup[] = [];

          snap.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IMatchup>) =>
            updates.push(doc.data()));
          
          setMatchups(updates);
        });

      const unsubToPredictions = db.collectionGroup("predictions")
        .where("ref.game", "==", state.game.id)
        .where("ref.creator", "==", state.player.id)
        .withConverter(predictionConverter)
        .onSnapshot((snap: firebase.firestore.QuerySnapshot) => {
          let updates: IPrediction[] = [];
          
          snap.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IPrediction>) =>
            updates.push(doc.data()));
            
          setPredictions(updates);
        });
        
      return () => {
        unsubToGame();
        unsubToPlayers();
        unsubToMatchups();
        unsubToPredictions();
      }
    }
  }, [state.game.id, state.player.id, state.day]);
}