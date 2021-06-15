import { useEffect } from "react";

import { GameService } from "../../../services/gameService";

import { IGame } from "../../../../stroll-models/game";
import { IGamePageState } from "../models/gamePageState";

import { GameErrorCode } from "../../../enums/gameErrorCode";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export const useFetchGameEffect = (id: string, state: IGamePageState, setState: (state: IGamePageState) => void): IGamePageState => { 
  useEffect(() => {
    if(id.trim() !== "") {
      const fetch = async (): Promise<void> => {
        try {
          const game: IGame = await GameService.fetchGame(id);
          
          if(game !== null) {
            setState({ ...state, game, status: RequestStatus.Success });
          } else {
            throw new Error(GameErrorCode.DoesNotExist);
          }
        } catch (err) {
          console.error(err);

          if(err.message === GameErrorCode.DoesNotExist) {
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
