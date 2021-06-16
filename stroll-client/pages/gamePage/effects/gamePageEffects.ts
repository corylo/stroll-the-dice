import { useEffect } from "react";

import { GameService } from "../../../services/gameService";
import { InviteService } from "../../../services/inviteService";

import { ErrorUtility } from "../../../utilities/errorUtility";

import { IGame } from "../../../../stroll-models/game";
import { IGamePageState } from "../models/gamePageState";
import { IInvite } from "../../../../stroll-models/invite";

import { DocumentType } from "../../../../stroll-enums/documentType";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export const useFetchGameEffect = (id: string, state: IGamePageState, setState: (state: IGamePageState) => void): IGamePageState => { 
  useEffect(() => {
    if(id.trim() !== "") {
      const fetch = async (): Promise<void> => {
        try {
          const game: IGame = await GameService.get(id),
            invite: IInvite = await InviteService.get(game);

          if(game !== null) {
            setState({ ...state, game, invite, status: RequestStatus.Success });
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
  
  return state;
}
