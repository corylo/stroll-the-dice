import { useEffect, useState } from "react";

import { GameService } from "../../../services/gameService";
import { GameSummaryService } from "../../../services/gameSummaryService";
import { InviteService } from "../../../services/inviteService";

import { ErrorUtility } from "../../../utilities/errorUtility";
import { InviteUtility } from "../../../utilities/inviteUtility";
import { UrlUtility } from "../../../utilities/urlUtility";

import { IGame } from "../../../../stroll-models/game";
import { IGamePageState } from "../models/gamePageState";
import { IGameSummary } from "../../../../stroll-models/gameSummary";
import { IInvite } from "../../../../stroll-models/invite";
import { IUser } from "../../../models/user";

import { DocumentType } from "../../../../stroll-enums/documentType";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export const useFetchGameEffect = (id: string, state: IGamePageState, setState: (state: IGamePageState) => void): void => { 
  useEffect(() => {
    if(id.trim() !== "") {
      const fetch = async (): Promise<void> => {
        try {
          const game: IGame = await GameService.get(id),
            invite: IInvite = await InviteService.get.by.game(game),
            summary: IGameSummary = await GameSummaryService.get(id);

          if(game !== null) {
            setState({ 
              ...state, 
              game, 
              invite, 
              status: RequestStatus.Success,
              summary
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
            toggles: { ...state.toggles, invite: true } 
          });
        } catch (err) {
          console.error(err);
        }
      }
    }

    load();
  }, [user, state.game, state.invite]);
}