import { useEffect, useState } from "react";
import firebase from "firebase/app";

import { db } from "../../../config/firebase";

import { InviteService } from "../../../services/inviteService";
import { PlayerService } from "../../../services/playerService";
import { ProfileService } from "../../../services/profileService";

import { GameDurationUtility } from "../../../../stroll-utilities/gameDurationUtility";
import { PlayerUtility } from "../../../utilities/playerUtility";
import { RoleUtility } from "../../../../stroll-utilities/roleUtility";

import { IAppState } from "../../../components/app/models/appState";
import { defaultGame, gameConverter, IGame } from "../../../../stroll-models/game";
import { IGamePageState } from "../models/gamePageState";
import { IPlayer, playerConverter } from "../../../../stroll-models/player";
import { IProfile } from "../../../../stroll-models/profile";

import { AppStatus } from "../../../enums/appStatus";
import { GameStatus } from "../../../../stroll-enums/gameStatus";
import { PlayerStatus } from "../../../../stroll-enums/playerStatus";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";

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
    
    if(players.length > 0) {
      updates.players = players;

      const creator: IPlayer = PlayerUtility.getById(game.creatorUID, players);

      if(creator) {
        updates.creator = creator.profile;
      }

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
  }, [appState.user, state.statuses.player, game, players]);

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
          (updates.statuses.player === PlayerStatus.Playing || RoleUtility.isAdmin(appState.user.roles)) &&
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
        (state.statuses.player === PlayerStatus.NotPlaying && RoleUtility.isAdmin(appState.user.roles))
      )
    ) {    
      const unsubToPlayers = db.collection("games")
        .doc(state.game.id)
        .collection("players")
        .withConverter(playerConverter)
        .onSnapshot((snap: firebase.firestore.QuerySnapshot) => {
          let updates: IPlayer[] = [];

          snap.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IPlayer>) =>
            updates.push(doc.data()));

          setPlayers(PlayerUtility.mapPlaceholderProfiles(updates));
        });

      return () => {
        unsubToPlayers();
      }
    }
  }, [state.game.id, state.statuses.player]);

  useEffect(() => {
    if(state.players.length === players.length) {
      const unmappedPlayers: IPlayer[] = players.filter((player: IPlayer) => player.profile.uid === "");

      if(unmappedPlayers.length > 0) {   
        const update = async (): Promise<void> => {     
          const mappedPlayers: IPlayer[] = await PlayerService.getProfiles(unmappedPlayers);

          const updatedPlayers: IPlayer[] = [...players].map((player: IPlayer) => {
            const match: IPlayer = PlayerUtility.getById(player.id, mappedPlayers);

            return match || player;
          });
          
          setPlayers(updatedPlayers);
        }

        update();
      }
    }
  }, [state.players, players]);

  useEffect(() => {
    if(state.statuses.player === PlayerStatus.NotPlaying) {
      const fetchCreatorProfile = async (): Promise<void> => {
        try {
          const creator: IProfile = await ProfileService.get.by.uid(state.game.creatorUID);

          setState({ ...state, creator });
        } catch (err) {
          console.error(err);
        }
      }

      fetchCreatorProfile();
    }
  }, [state.statuses.player]);
}