import { useEffect, useState } from "react";
import firebase from "firebase/app";

import { db } from "../../../firebase";

import { InviteService } from "../../../services/inviteService";
import { PlayerService } from "../../../services/playerService";

import { GameDurationUtility } from "../../../../stroll-utilities/gameDurationUtility";
import { MatchupUtility } from "../../../utilities/matchupUtility";
import { PlayerUtility } from "../../../utilities/playerUtility";

import { IAppState } from "../../../components/app/models/appState";
import { defaultGame, gameConverter, IGame } from "../../../../stroll-models/game";
import { IGamePageState } from "../models/gamePageState";
import { IMatchup, matchupConverter } from "../../../../stroll-models/matchup";
import { IPlayer, playerConverter } from "../../../../stroll-models/player";
import { IPrediction, predictionConverter } from "../../../../stroll-models/prediction";

import { AppStatus } from "../../../enums/appStatus";
import { GameStatus } from "../../../../stroll-enums/gameStatus";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export const useGameListenersEffect = (id: string, appState: IAppState, state: IGamePageState, setState: (state: IGamePageState) => void): void => {
  const [game, setGame] = useState<IGame>(defaultGame()),
    [players, setPlayers] = useState<IPlayer[]>([]),
    [matchups, setMatchups] = useState<IMatchup[]>([]),
    [predictions, setPredictions] = useState<IPrediction[]>([]);
  
  useEffect(() => {    
    const updates: IGamePageState = { ...state };
    
    if(game.id !== "") {
      updates.game = game;

      if(updates.status === RequestStatus.Loading) {
        updates.status = RequestStatus.Success;

        updates.day = GameDurationUtility.getDay(game);
      }
    }

    const player: IPlayer = PlayerUtility.getByUser(appState.user, players);

    if(player) {
      updates.player = player;
    }

    if(matchups.length > 0) {
      updates.matchups = MatchupUtility.mapPlayers(matchups, players);

      if(updates.statuses.matchups === RequestStatus.Loading) {
        updates.statuses.matchups = RequestStatus.Success;
      }
    }

    if(players.length > 0) {
      updates.players = players;

      if(updates.statuses.players === RequestStatus.Loading) {
        updates.statuses.players = RequestStatus.Success;
      }
    }

    if(predictions.length > 0) {
      updates.predictions = predictions;

      if(updates.statuses.predictions === RequestStatus.Loading) {
        updates.statuses.predictions = RequestStatus.Success;
      }
    }
    
    setState(updates);
  }, [appState.user, game, matchups, players, predictions]);

  useEffect(() => {   
    if(id.trim() !== "" && appState.status !== AppStatus.Loading) {     
      const unsubToGame = db.collection("games")
        .doc(id)
        .withConverter(gameConverter)
        .onSnapshot((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {          
          if(doc.exists) {
            setGame(doc.data());
          } else {
            setState({ ...state, status: RequestStatus.Error });
          }
        });

      return () => unsubToGame();
    }
  }, [id, appState.status]);

  useEffect(() => {    
    if(appState.status === AppStatus.SignedIn && state.game.id !== "") {
      const fetch = async (): Promise<void> => {
        const updates: IGamePageState = { 
          ...state,
          status: RequestStatus.Success
        };

        const player: IPlayer = await PlayerService.get.by.id(game.id, appState.user.profile.uid);

        if(player) {
          updates.player = player;

          updates.statuses.matchups = RequestStatus.Loading;
          updates.statuses.players = RequestStatus.Loading;
          updates.statuses.predictions = RequestStatus.Loading;
          
          if(state.game.status === GameStatus.Upcoming) {
            updates.invite = await InviteService.get.by.game(game);
          }
        }

        setState(updates);
      }

      fetch();
    }            
  }, [appState.status, state.game.id]);

  useEffect(() => {        
    if(state.game.id !== "" && state.player.id !== "") {        
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
        unsubToPlayers();
        unsubToMatchups();
        unsubToPredictions();
      }
    }
  }, [state.game.id, state.player.id, state.day]);
}