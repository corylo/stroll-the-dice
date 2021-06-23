import { useEffect, useState } from "react";
import firebase from "firebase/app";

import { db } from "../../../firebase";

import { MatchupUtility } from "../../../utilities/matchupUtility";

import { IGamePageState } from "../models/gamePageState";
import { IMatchup, matchupConverter } from "../../../../stroll-models/matchup";
import { IPrediction, predictionConverter } from "../../../../stroll-models/prediction";
import { IPlayer, playerConverter } from "../../../../stroll-models/player";

export const useGameListenersEffect = (state: IGamePageState, setState: (state: IGamePageState) => void): void => {
  const [player, setPlayer] = useState<IPlayer>(state.player),
    [matchups, setMatchups] = useState<IMatchup[]>([]),
    [predictions, setPredictions] = useState<IPrediction[]>([]);
  
  useEffect(() => {
    setState({ ...state, matchups, player, predictions });
  }, [matchups, player, predictions]);
  
  useEffect(() => {    
    if(
      state.game !== null && 
      state.player.id !== ""
    ) {
      const unsubToPlayer = db.collection("games")
        .doc(state.game.id)
        .collection("players")
        .doc(state.player.id)
        .withConverter(playerConverter)
        .onSnapshot((doc: firebase.firestore.DocumentSnapshot<IPlayer>) => {
          const update: IPlayer = { ...doc.data(), id: doc.id };
          
          setPlayer(update);
        });
        
      return () => {
        unsubToPlayer();
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
          
          setMatchups(MatchupUtility.mapPlayers(updates, state.players));
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