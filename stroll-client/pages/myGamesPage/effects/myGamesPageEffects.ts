import { useEffect } from "react";

import { GameService } from "../../../services/gameService";

import { IGetGamesResponse } from "../../../../stroll-models/getGamesResponse";
import { IMyGamesPageState, IMyGamesPageStatuses } from "../models/myGamesPageState";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export const useFetchGamesEffect = (
  state: IMyGamesPageState, 
  uid: string,
  setState: (state: IMyGamesPageState) => void
): void => {
  useEffect(() => {
    const updateStatuses = (statuses: any): void => {
      setState({ ...state, statuses: { ...state.statuses, ...statuses } });
    }
  
    if(uid !== "" && state.status !== null) {
      const fetch = async (): Promise<void> => {
        try {
          if(state.offset !== null) {
            updateStatuses({ more: RequestStatus.Loading });
          }

          const res: IGetGamesResponse = await GameService.getGrouped(uid, state.status, state.groupBy, state.limit,  state.offset);

          const statuses: IMyGamesPageStatuses = { ...state.statuses };

          if(state.offset === null) {
            statuses.initial = RequestStatus.Success;
          } else {
            statuses.more = RequestStatus.Success;
          }

          setState({ 
            ...state, 
            end: res.games.length < state.limit,
            games: [...state.games, ...res.games], 
            offset: res.offset,
            statuses 
          });
        } catch (err) {
          console.error(err);

          if(state.offset === null) {
            updateStatuses({ initial: RequestStatus.Error });
          } else {
            updateStatuses({ more: RequestStatus.Error });
          }
        }
      }

      fetch();
    }
  }, [uid, state.status, state.groupBy, state.index]);
}