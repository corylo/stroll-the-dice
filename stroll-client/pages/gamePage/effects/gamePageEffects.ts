import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { GameService } from "../../../services/gameService";
import { InviteService } from "../../../services/inviteService";
import { PlayerService } from "../../../services/playerService";

import { ErrorUtility } from "../../../utilities/errorUtility";
import { InviteUtility } from "../../../utilities/inviteUtility";
import { UrlUtility } from "../../../utilities/urlUtility";

import { IAppState } from "../../../components/app/models/appState";
import { IGame } from "../../../../stroll-models/game";
import { IGamePageState } from "../models/gamePageState";
import { IGamePageStateToggles } from "../models/gamePageStateToggles";
import { IInvite } from "../../../../stroll-models/invite";
import { IPlayer } from "../../../../stroll-models/player";

import { AppAction } from "../../../enums/appAction";
import { AppStatus } from "../../../enums/appStatus";
import { DocumentType } from "../../../../stroll-enums/documentType";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export const useFetchGameEffect = (id: string, state: IGamePageState, setState: (state: IGamePageState) => void): void => { 
  useEffect(() => {
    if(id.trim() !== "") {
      const fetch = async (): Promise<void> => {
        try {
          const game: IGame = await GameService.get(id),
            invite: IInvite = await InviteService.get.by.game(game);

          if(game !== null) {
            setState({ 
              ...state, 
              game, 
              invite, 
              status: RequestStatus.Success,
              toggles: {
                ...state.toggles,
                playing: invite !== null
              }
            });
          } else {
            throw new Error(ErrorUtility.doesNotExist(DocumentType.Game));
          }
        } catch (err) {
          console.error(err);

          if(err.message === ErrorUtility.doesNotExist(DocumentType.Game)) {
            setState({ ...state, status: RequestStatus.Error, message: err.message });
          } else {
            setState({ ...state, status: RequestStatus.Error, message: "" });
          }
        }
      }

      fetch();
    }
  }, [id]);
}

export const useGameInviteEffect = (
  appState: IAppState, 
  state: IGamePageState,   
  dispatch: (type: AppAction, payload?: any) => void,
  setState: (state: IGamePageState) => void
): void => {
  const [inviteID] = useState<string>(UrlUtility.getQueryParam("invite"));

  const history: any = useHistory();

  useEffect(() => {
    const load = async (): Promise<void> => {
      if(InviteUtility.showInvite(inviteID, state.invite, state.game, appState.user)) {
        try {
          const invite: IInvite = await InviteService.get.by.id(state.game, inviteID);

          const toggles: IGamePageStateToggles = {
            ...state.toggles,
            accept: true,
            playing: true
          }

          setState({ ...state, invite, toggles });
        } catch (err) {
          console.error(err);
        }
      } else if (inviteID && appState.status === AppStatus.SignedOut) {
        dispatch(AppAction.ToggleSignIn, true);
      } else if (inviteID && appState.status === AppStatus.SignedIn) {
        UrlUtility.clearParam(history, "invite");
      }
    }

    load();
  }, [appState.user, appState.status, state.game, state.invite]);
}

export const useFetchPlayersEffect = (
  state: IGamePageState, 
  setState: (state: IGamePageState) => void, 
  setStatus: (status: RequestStatus) => void
): void => { 
  useEffect(() => {
    const fetch = async (): Promise<void> => {
      if(state.toggles.playing && state.toggles.players) {
        try {
          setStatus(RequestStatus.Loading);

          const players: IPlayer[] = await PlayerService.getByGame(state.game.id);

          setState({ 
            ...state, 
            players, 
            game: { 
              ...state.game, 
              counts: {
                ...state.game.counts,
                players: players.length
              } 
            } 
          });

          setStatus(RequestStatus.Success);
        } catch (err) {
          console.error(err);
          
          setStatus(RequestStatus.Error);
        }
      }
    }

    fetch();
  }, [state.invite, state.toggles.players]);
}