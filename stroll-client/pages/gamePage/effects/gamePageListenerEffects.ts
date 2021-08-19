import { useEffect, useState } from "react";
import firebase from "firebase/app";

import { db } from "../../../config/firebase";

import { InviteService } from "../../../services/inviteService";
import { PlayerService } from "../../../services/playerService";

import { GameDurationUtility } from "../../../../stroll-utilities/gameDurationUtility";
import { PlayerUtility } from "../../../utilities/playerUtility";

import { IAppState } from "../../../components/app/models/appState";
import { defaultGame, gameConverter, IGame } from "../../../../stroll-models/game";
import { IGameEvent } from "../../../../stroll-models/gameEvent/gameEvent";
import { IGamePageState } from "../models/gamePageState";
import { IPlayer, playerConverter } from "../../../../stroll-models/player";

import { AppStatus } from "../../../enums/appStatus";
import { GameStatus } from "../../../../stroll-enums/gameStatus";
import { PlayerStatus } from "../../../../stroll-enums/playerStatus";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";
import { Role } from "../../../../stroll-enums/role";

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
    
    if(players.length > 0) {
      updates.players = players;

      if(updates.statuses.players === RequestStatus.Loading) {
        updates.statuses.players = RequestStatus.Success;
      }

      if(state.statuses.player === PlayerStatus.Playing) {
        updates.player = PlayerUtility.getByUser(appState.user, players);
      }
    } else if (players.length === 0 && state.statuses.player === PlayerStatus.NotPlaying) {
      updates.players = [];

      updates.statuses.players = RequestStatus.Success;
    }

    setState(updates);
  }, [appState.user, state.statuses.player, game, players, events]);

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
    if(
      appState.status === AppStatus.SignedIn && 
      state.game.id !== ""
    ) {
      const fetch = async (): Promise<void> => {
        const updates: IGamePageState = { ...state };

        updates.statuses.game = RequestStatus.Success;

        const player: IPlayer = await PlayerService.get.by.id(game.id, appState.user.profile.uid);

        if(player) {
          updates.player = player;

          updates.statuses.player = PlayerStatus.Playing;
        } else {
          updates.statuses.player = PlayerStatus.NotPlaying;
        }

        if(
          (updates.statuses.player === PlayerStatus.Playing || appState.user.roles.includes(Role.Admin)) &&
          state.game.status === GameStatus.Upcoming
        ) {          
          updates.invite = await InviteService.get.by.game(game);
        }

        setState(updates);
      }

      fetch();
    }            
  }, [appState.status, state.game.id]);

  useEffect(() => {      
    if(
      state.game.id !== "" && (
        state.statuses.player === PlayerStatus.Playing ||
        (state.statuses.player === PlayerStatus.NotPlaying && appState.user.roles.includes(Role.Admin))
      )
    ) {    
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
  }, [state.game.id, state.statuses.player, eventsLimit]);
}