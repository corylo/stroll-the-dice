import { useEffect, useState } from "react";
import firebase from "firebase/app";

import { db } from "../../../firebase";

import { MatchupUtility } from "../../../utilities/matchupUtility";
import { PlayerUtility } from "../../../utilities/playerUtility";

import { IAppState } from "../../../components/app/models/appState";
import { IGamePageState } from "../models/gamePageState";
import { IMatchup, matchupConverter } from "../../../../stroll-models/matchup";
import { IPrediction, predictionConverter } from "../../../../stroll-models/prediction";
import { IPlayer, playerConverter } from "../../../../stroll-models/player";

export const useGameListenersEffect = (appState: IAppState, state: IGamePageState, setState: (state: IGamePageState) => void): void => {
  const [players, setPlayers] = useState<IPlayer[]>([]),
    [matchups, setMatchups] = useState<IMatchup[]>([]),
    [predictions, setPredictions] = useState<IPrediction[]>([]);
  
  useEffect(() => {    
    const updates: IGamePageState = {
      ...state, 
      matchups: MatchupUtility.mapPlayers(matchups, players), 
      players, 
      predictions
    }

    const player: IPlayer = PlayerUtility.getByUser(appState.user, players);

    if(player) {
      updates.player = player;
    }
      
    setState(updates);
  }, [appState.user, matchups, players, predictions]);
  
  useEffect(() => {    
    if(state.game !== null && state.player.id !== "") {
      const unsubToPlayers = db.collection("games")
        .doc(state.game.id)
        .collection("players")
        .withConverter(playerConverter)
        .onSnapshot((snap: firebase.firestore.QuerySnapshot) => {
          let updates: IPlayer[] = [];

          snap.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IPlayer>) =>
            updates.push({ ...doc.data(), id: doc.id }));
          
          setPlayers(updates);
        });
        
      return () => {
        unsubToPlayers();
      }
    }
  }, [state.game, state.player.id]);

  useEffect(() => {        
    if(state.game !== null && state.player.id !== "") {
      const unsubToMatchups = db.collection("games")
        .doc(state.game.id)
        .collection("matchups")
        .orderBy("createdAt")
        .withConverter(matchupConverter)
        .onSnapshot((snap: firebase.firestore.QuerySnapshot) => {
          let updates: IMatchup[] = [];

          snap.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IMatchup>) =>
            updates.push({ ...doc.data(), id: doc.id }));
          
          setMatchups(updates);
        });

      const unsubToPredictions = db.collectionGroup("predictions")
        .where("ref.game", "==", state.game.id)
        .where("ref.creator", "==", state.player.id)
        .withConverter(predictionConverter)
        .onSnapshot((snap: firebase.firestore.QuerySnapshot) => {
          let updates: IPrediction[] = [];

          snap.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IPrediction>) =>
            updates.push({ ...doc.data(), id: doc.id }));
          
          setPredictions(updates);
        });
        
      return () => {
        unsubToMatchups();
        unsubToPredictions();
      }
    }
  }, [state.game, state.player.id]);
}