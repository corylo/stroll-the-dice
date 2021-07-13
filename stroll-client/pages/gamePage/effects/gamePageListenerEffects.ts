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
import { IMatchupListState } from "../models/matchupListState";
import { IPlayer, playerConverter } from "../../../../stroll-models/player";
import { IPrediction, predictionConverter } from "../../../../stroll-models/prediction";

import { AppStatus } from "../../../enums/appStatus";
import { GameStatus } from "../../../../stroll-enums/gameStatus";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export const useMatchupListenerEffect = (
  gameState: IGamePageState, 
  state: IMatchupListState,
  day: number,
  setState: (state: IMatchupListState) => void
): void => {
  const { game, player, players } = gameState;

  const [matchups, setMatchups] = useState<IMatchup[]>([]),
    [predictions, setPredictions] = useState<IPrediction[]>([]);

  const [matchupsSynced, setMatchupsSynced] = useState<boolean>(false),
    [predictionsSynced, setPredictionsSynced] = useState<boolean>(false);

  useEffect(() => {
    const updates: IMatchupListState = { ...state };

    if(matchupsSynced && state.statuses.matchups === RequestStatus.Loading) {
      updates.statuses.matchups = RequestStatus.Success;
    }

    if(predictionsSynced && state.statuses.predictions === RequestStatus.Loading) {
      updates.statuses.predictions = RequestStatus.Success;
    }    

    setState(updates);
  }, [matchupsSynced, predictionsSynced]);

  useEffect(() => {    
    const updates: IMatchupListState = { ...state };
    
    if(matchups.length > 0) {
      updates.matchups = matchups;
    }

    if(predictions.length > 0) {
      updates.predictions = predictions;
    }

    setState(updates);
  }, [matchups, predictions]);
  
  useEffect(() => {
    if(players.length > 0) {
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
  
          setMatchups(MatchupUtility.mapPlayers(updates, players));

          setMatchupsSynced(true);
        });

      return () => {
        unsubToMatchups();
      }
    }
  }, [day, players]);
  
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

export const useGameListenersEffect = (id: string, appState: IAppState, state: IGamePageState, setState: (state: IGamePageState) => void): void => {
  const [game, setGame] = useState<IGame>(defaultGame()),
    [players, setPlayers] = useState<IPlayer[]>([]);
  
  useEffect(() => {    
    const updates: IGamePageState = { ...state };
    
    if(game.id !== "") {
      updates.game = game;

      if(updates.statuses.game === RequestStatus.Loading) {
        updates.statuses.game = RequestStatus.Success;

        updates.day = GameDurationUtility.getDay(game);
      }
    }

    const player: IPlayer = PlayerUtility.getByUser(appState.user, players);

    if(player) {
      updates.player = player;

      updates.statuses.players = RequestStatus.Loading;
    }

    if(players.length > 0) {
      updates.players = players;

      if(updates.statuses.players === RequestStatus.Loading) {
        updates.statuses.players = RequestStatus.Success;
      }
    }

    setState(updates);
  }, [appState.user, game, players]);

  useEffect(() => {   
    if(id.trim() !== "" && appState.status !== AppStatus.Loading) {     
      const unsubToGame = db.collection("games")
        .doc(id)
        .withConverter(gameConverter)
        .onSnapshot((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {          
          if(doc.exists) {
            setGame(doc.data());
          } else {
            setState({ ...state, statuses: {
              ...state.statuses,
              game: RequestStatus.Error 
            }});
          }
        });

      return () => unsubToGame();
    }
  }, [id, appState.status]);

  useEffect(() => {    
    if(appState.status === AppStatus.SignedIn && state.game.id !== "") {
      const fetch = async (): Promise<void> => {
        const updates: IGamePageState = { ...state };

        updates.statuses.game = RequestStatus.Success;

        const player: IPlayer = await PlayerService.get.by.id(game.id, appState.user.profile.uid);

        if(player) {
          updates.player = player;

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

      return () => {
        unsubToPlayers();
      }
    }
  }, [state.game.id, state.player.id, state.day]);
}