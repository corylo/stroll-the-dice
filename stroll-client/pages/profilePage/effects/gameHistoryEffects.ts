import { useEffect } from "react";

import { GameHistoryService } from "../../../services/gameHistoryService";

import { IGetGameHistoryResponse } from "../../../../stroll-models/getGameHistoryResponse";
import { defaultViewGameHistoryState, IViewGameHistoryState, IViewGameHistoryStatuses } from "../models/viewGameHistoryState";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export const useFetchGameHistoryEffect = (
  state: IViewGameHistoryState, 
  toggled: boolean,
  uid: string,
  setState: (state: IViewGameHistoryState) => void
): void => {
  useEffect(() => {
    const updateStatuses = (statuses: any): void => {
      setState({ ...state, statuses: { ...state.statuses, ...statuses } });
    }
  
    if(toggled) {
      const fetch = async (): Promise<void> => {
        try {
          if(state.offset !== null) {
            updateStatuses({ more: RequestStatus.Loading });
          }

          const res: IGetGameHistoryResponse = await GameHistoryService.get(uid, state.limit, state.offset);

          const statuses: IViewGameHistoryStatuses = { ...state.statuses };

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
  }, [toggled, state.index]);

  useEffect(() => {
    if(!toggled) {
      setState(defaultViewGameHistoryState());
    }
  }, [toggled]);
}