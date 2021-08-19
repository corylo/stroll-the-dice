import { useContext, useEffect, useState } from "react";
import firebase from "firebase/app";

import { db } from "../../../config/firebase";

import { GamePageContext } from "../gamePage";

import { IGameDayState } from "../models/gameDayState";
import { gameDaySummaryConverter, IGameDaySummary, IGameDaySummaryPlayerReference } from "../../../../stroll-models/gameDaySummary";
import { IMatchup, matchupConverter } from "../../../../stroll-models/matchup";
import { IPrediction, predictionConverter } from "../../../../stroll-models/prediction";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export const useGameDayListenerEffect = (
  state: IGameDayState,
  day: number,
  setState: (state: IGameDayState) => void
): void => {
  const { state: gameState } = useContext(GamePageContext);

  const { game, player } = gameState;

  const [matchups, setMatchups] = useState<IMatchup[]>([]),
    [players, setPlayers] = useState<IGameDaySummaryPlayerReference[]>([]),
    [predictions, setPredictions] = useState<IPrediction[]>([]);

  const [matchupsInitiated, setMatchupsInitiated] = useState<boolean>(false),
    [matchupsSynced, setMatchupsSynced] = useState<boolean>(false),
    [predictionsSynced, setPredictionsSynced] = useState<boolean>(false),
    [summarySyncStatus, setSummarySyncStatus] = useState<RequestStatus>(RequestStatus.Loading);

  useEffect(() => {
    if(state.expanded) {
      setMatchupsInitiated(true);
    }
  }, [state.expanded]);

  useEffect(() => {
    const updates: IGameDayState = { ...state };

    if(matchupsSynced && state.statuses.matchups === RequestStatus.Loading) {
      updates.statuses.matchups = RequestStatus.Success;
    }

    if(predictionsSynced && state.statuses.predictions === RequestStatus.Loading) {
      updates.statuses.predictions = RequestStatus.Success;
    }    

    if(summarySyncStatus === RequestStatus.Success && state.statuses.summary !== RequestStatus.Success) {
      updates.statuses.matchups = RequestStatus.Success;
      updates.statuses.summary = RequestStatus.Success;
    } else if(summarySyncStatus === RequestStatus.Idle && state.statuses.predictions === RequestStatus.Loading) {
      updates.statuses.summary = RequestStatus.Idle;
    }

    setState(updates);
  }, [matchupsSynced, predictionsSynced, summarySyncStatus]);

  useEffect(() => {    
    const updates: IGameDayState = { ...state };
    
    if(matchups.length > 0) {
      updates.matchups = matchups;
    }

    if(players.length > 0) {
      updates.players = players;
    }

    if(predictions.length > 0) {
      updates.predictions = predictions;
    }

    setState(updates);
  }, [matchups, players, predictions]);

  useEffect(() => {    
    if(matchupsInitiated && gameState.players.length > 0) {
      const unsubToMatchups = db.collection("games")
        .doc(game.id)
        .collection("day_summaries")
        .doc(day.toString())
        .withConverter(gameDaySummaryConverter)
        .onSnapshot((doc: firebase.firestore.QueryDocumentSnapshot<IGameDaySummary>) => {          
          if(doc.exists) {
            const summary: IGameDaySummary = doc.data();

            setMatchups(summary.matchups);

            setPlayers(summary.players);

            setSummarySyncStatus(RequestStatus.Success);
          } else {
            setSummarySyncStatus(RequestStatus.Idle);
          }
        });

      return () => {
        unsubToMatchups();
      }
    }
  }, [day, gameState.players, matchupsInitiated]);
  
  useEffect(() => {
    if(matchupsInitiated && gameState.players.length > 0 && state.statuses.summary === RequestStatus.Idle) {
      const unsubToMatchups = db.collection("games")
        .doc(game.id)
        .collection("matchups")
        .where("day", "==", day)      
        .orderBy("createdAt")
        .withConverter(matchupConverter)
        .onSnapshot((snap: firebase.firestore.QuerySnapshot) => {
          let updates: IMatchup[] = [];

          snap.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IMatchup>) =>
            updates.push(doc.data()));

          setMatchups(updates);

          setMatchupsSynced(true);
        });

      return () => {
        unsubToMatchups();
      }
    }
  }, [day, gameState.players, matchupsInitiated, state.statuses.summary]);
  
  useEffect(() => {
    if(matchups.length > 0) {
      const unsubToPredictions = db.collectionGroup("predictions")
        .where("ref.game", "==", game.id)
        .where("ref.creator", "==", player.id)
        .where("ref.matchup", "in", matchups.map((matchup: IMatchup) => matchup.id))
        .withConverter(predictionConverter)
        .onSnapshot((snap: firebase.firestore.QuerySnapshot) => {
          let updates: IPrediction[] = [];
          
          snap.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IPrediction>) =>
            updates.push(doc.data()));

          setPredictions(updates);
          
          setPredictionsSynced(true);
        });
        
      return () => {
        unsubToPredictions();
      }
    }
  }, [matchups]);
}