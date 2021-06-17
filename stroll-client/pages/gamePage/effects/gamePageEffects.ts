import { useEffect, useState } from "react";

import { GameService } from "../../../services/gameService";
import { InviteService } from "../../../services/inviteService";
import { PlayerService } from "../../../services/playerService";

import { ErrorUtility } from "../../../utilities/errorUtility";
import { InviteUtility } from "../../../utilities/inviteUtility";
import { UrlUtility } from "../../../utilities/urlUtility";

import { IGame } from "../../../../stroll-models/game";
import { IGamePageState } from "../models/gamePageState";
import { IInvite } from "../../../../stroll-models/invite";
import { IPlayer } from "../../../../stroll-models/player";
import { IUser } from "../../../models/user";

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
              status: RequestStatus.Success
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

export const useGameInviteEffect = (user: IUser, state: IGamePageState, setState: (state: IGamePageState) => void): void => {
  const [inviteID] = useState<string>(UrlUtility.getQueryParam("invite"));

  useEffect(() => {
    const load = async (): Promise<void> => {
      if(InviteUtility.showInvite(inviteID, state.invite, state.game, user)) {
        try {
          const invite: IInvite = await InviteService.get.by.id(state.game, inviteID);

          setState({ 
            ...state, 
            invite,
            toggles: { ...state.toggles, accept: true } 
          });
        } catch (err) {
          console.error(err);
        }
      }
    }

    load();
  }, [user, state.game, state.invite]);
}

export const useFetchPlayersEffect = (
  state: IGamePageState, 
  setState: (state: IGamePageState) => void, 
  setStatus: (status: RequestStatus) => void
): void => { 
  useEffect(() => {
    const fetch = async (): Promise<void> => {
      if(state.invite !== null && state.toggles.players) {
        try {
          setStatus(RequestStatus.Loading);

          const players: IPlayer[] = await PlayerService.getByGame(state.game.id);

          setState({ ...state, players });

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