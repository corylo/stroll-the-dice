import { useEffect } from "react";

import { GameDayHistoryService } from "../../../services/gameDayHistoryService";

import { IMyGameDaysPageState, IMyGameDaysPageStatuses } from "../models/myGameDaysPageState";

import { IGetGameDayHistoryResponse } from "../../../../stroll-models/getGameDayHistoryResponse";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export const useFetchGameDayHistoryEffect = (
  state: IMyGameDaysPageState, 
  uid: string,
  setState: (state: IMyGameDaysPageState) => void
): void => {
  useEffect(() => {
    const updateStatuses = (statuses: any): void => {
      setState({ ...state, statuses: { ...state.statuses, ...statuses } });
    }
  
    if(uid !== "") {
      const fetch = async (): Promise<void> => {
        try {
          if(state.offset !== null) {
            updateStatuses({ more: RequestStatus.Loading });
          } else {            
            updateStatuses({ initial: RequestStatus.Loading });
          }

          const res: IGetGameDayHistoryResponse = await GameDayHistoryService.get(uid, state.limit, state.offset);
          
          const statuses: IMyGameDaysPageStatuses = { ...state.statuses };

          if(state.offset === null) {
            statuses.initial = RequestStatus.Success;
          } else {
            statuses.more = RequestStatus.Success;
          }

          setState({ 
            ...state, 
            end: res.entries.length < state.limit,
            entries: [...state.entries, ...res.entries], 
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
  }, [uid, state.index]);
}