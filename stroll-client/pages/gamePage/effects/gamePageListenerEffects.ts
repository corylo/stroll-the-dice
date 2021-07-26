import { useContext, useEffect, useState } from "react";
import firebase from "firebase/app";

import { db } from "../../../firebase";

import { GamePageContext } from "../gamePage";

import { InviteService } from "../../../services/inviteService";
import { PlayerService } from "../../../services/playerService";

import { GameDurationUtility } from "../../../../stroll-utilities/gameDurationUtility";
import { MatchupUtility } from "../../../utilities/matchupUtility";
import { PlayerUtility } from "../../../utilities/playerUtility";

import { IAppState } from "../../../components/app/models/appState";
import { defaultGame, gameConverter, IGame } from "../../../../stroll-models/game";
import { gameEventConverter, IGameEvent } from "../../../../stroll-models/gameEvent/gameEvent";
import { IGamePageState } from "../models/gamePageState";
import { IMatchup, matchupConverter } from "../../../../stroll-models/matchup";
import { IMatchupGroupState } from "../models/matchupGroupState";
import { IPlayer, playerConverter } from "../../../../stroll-models/player";
import { IPrediction, predictionConverter } from "../../../../stroll-models/prediction";

import { AppStatus } from "../../../enums/appStatus";
import { GameEventCategory } from "../../../../stroll-enums/gameEventCategory";
import { GameEventReferenceID } from "../../../../stroll-enums/gameEventReferenceID";
import { GameStatus } from "../../../../stroll-enums/gameStatus";
import { PlayerStatus } from "../../../../stroll-enums/playerStatus";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export const useMatchupListenerEffect = (
  state: IMatchupGroupState,
  day: number,
  setState: (state: IMatchupGroupState) => void
): void => {
  const { state: gameState, setState: setGameState } = useContext(GamePageContext);

  const { game, player, players } = gameState;

  const [matchups, setMatchups] = useState<IMatchup[]>([]),
    [predictions, setPredictions] = useState<IPrediction[]>([]);

  const [matchupsInitiated, setMatchupsInitiated] = useState<boolean>(false),
    [matchupsSynced, setMatchupsSynced] = useState<boolean>(false),
    [predictionsSynced, setPredictionsSynced] = useState<boolean>(false);

  useEffect(() => {
    if(state.expanded) {
      setMatchupsInitiated(true);
    }
  }, [state.expanded]);

  useEffect(() => {
    const updates: IMatchupGroupState = { ...state };

    if(matchupsSynced && state.statuses.matchups === RequestStatus.Loading) {
      updates.statuses.matchups = RequestStatus.Success;
    }

    if(predictionsSynced && state.statuses.predictions === RequestStatus.Loading) {
      updates.statuses.predictions = RequestStatus.Success;
    }    

    setState(updates);
  }, [matchupsSynced, predictionsSynced]);

  useEffect(() => {    
    const updates: IMatchupGroupState = { ...state };
    
    if(matchups.length > 0) {
      updates.matchups = matchups;
    }

    if(predictions.length > 0) {
      updates.predictions = predictions;
    }

    setState(updates);
  }, [matchups, predictions]);

  useEffect(() => {
    if(player.id && matchups.length > 0) {
      const matchup: IMatchup = MatchupUtility.getByPlayer(player.id, matchups);

      if(matchup && matchup.day === gameState.day) {
        const steps: number = MatchupUtility.getPlayerSteps(player.id, matchup);

        setGameState({ ...gameState, playerSteps: steps });
      }
    }
  }, [player.id, gameState.day, matchups]);
  
  useEffect(() => {
    if(matchupsInitiated && players.length > 0) {
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
  }, [day, players, matchupsInitiated]);
  
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
    [players, setPlayers] = useState<IPlayer[]>([]),
    [events, setEvents] = useState<IGameEvent[]>([]),
    [eventsLimit, setEventsLimit] = useState<number>(5);

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

    if(events.length > 0) {
      updates.events = events;

      if(updates.statuses.events === RequestStatus.Loading) {
        updates.statuses.events = RequestStatus.Success;
      }
    } else if(events.length === 0) {
      updates.events = [];

      updates.statuses.events = RequestStatus.Success;
    }

    setState(updates);
  }, [appState.user, game, players, events]);

  useEffect(() => {   
    if(
      id.trim() !== "" && 
      appState.status !== AppStatus.Loading
    ) {     
      const unsubToGame = db.collection("games")
        .doc(id)
        .withConverter(gameConverter)
        .onSnapshot((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {          
          if(doc.exists) {
            setGame(doc.data());
          } else {
            setState({ ...state, 
              game: defaultGame(),
              statuses: {
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

          updates.statuses.player = PlayerStatus.Playing;

          if(state.game.status === GameStatus.Upcoming) {
            updates.invite = await InviteService.get.by.game(game);
          }
        } else {
          updates.statuses.player = PlayerStatus.NotPlaying;
        }

        setState(updates);
      }

      fetch();
    }            
  }, [appState.status, state.game.id]);

  useEffect(() => {        
    if(state.game.id !== "" && state.statuses.player === PlayerStatus.Playing) {    
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

      let query: firebase.firestore.Query = db.collection("games")
        .doc(state.game.id)
        .collection("events");

      if(state.filters.eventCategory !== GameEventCategory.Unknown) {                
        query = query.where("category", "==", state.filters.eventCategory);
      }
        
      const unsubToEvents = query
        .where("referenceID", "in", [GameEventReferenceID.General, state.player.id])   
        .orderBy("occurredAt", "desc")        
        .limit(eventsLimit)
        .withConverter(gameEventConverter)
        .onSnapshot((snap: firebase.firestore.QuerySnapshot) => {
          let updates: IGameEvent[] = [];

          snap.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGameEvent>) =>
            updates.push(doc.data()));
 
          setEvents(updates);
        });

      return () => {
        unsubToPlayers();
        unsubToEvents();
      }
    }
  }, [state.game.id, state.statuses.player, eventsLimit, state.filters.eventCategory]);

  useEffect(() => {
    if(state.toggles.events && eventsLimit !== 20) {
      setEventsLimit(20);
    } else if (!state.toggles.events) {      
      setState({ ...state, filters: { 
        ...state.filters, 
        eventCategory: GameEventCategory.Game 
      }});
    }
  }, [state.toggles.events, eventsLimit]);

  useEffect(() => {
    const updates: IGamePageState = { ...state };

    if(state.statuses.events === RequestStatus.Success) {
      updates.statuses.events = RequestStatus.Loading;
    }
    
    setState(updates);
  }, [state.filters.eventCategory]);
}