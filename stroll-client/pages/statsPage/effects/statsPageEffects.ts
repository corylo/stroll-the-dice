import { useEffect } from "react";

import { GameHistoryService } from "../../../services/gameHistoryService";
import { ProfileStatsService } from "../../../services/profileStatsService";

import { IGetGameHistoryResponse } from "../../../../stroll-models/getGameHistoryResponse";
import { IProfileGamesStats } from "../../../../stroll-models/profileStats";
import { IStatsPageState, IStatsPageStatuses } from "../models/statsPageState";

import { AppStatus } from "../../../enums/appStatus";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";
import { ProfileStatsID } from "../../../../stroll-enums/profileStatsID";

export const useFetchGameStatsEffect = (
  appStatus: AppStatus,
  state: IStatsPageState,
  uid: string,
  setState: (state: IStatsPageState) => void
): void => {
  const updateStatsStatus = (status: RequestStatus): void => {
    setState({ ...state, statuses: { ...state.statuses, stats: status} });
  }

  useEffect(() => {
    if(appStatus === AppStatus.SignedIn && uid !== "") {
      const fetch = async (): Promise<void> => {
        try {
          updateStatsStatus(RequestStatus.Loading);

          const stats: IProfileGamesStats = await ProfileStatsService.getByUID(uid, ProfileStatsID.Games) as IProfileGamesStats;

          setState({ ...state, stats, statuses: { ...state.statuses, stats: RequestStatus.Success } });
        } catch (err) {
          console.error(err);

          updateStatsStatus(RequestStatus.Error);
        }
      }

      fetch();
    }
  }, [appStatus, uid]);
}

export const useFetchGameHistoryEffect = (
  state: IStatsPageState, 
  uid: string,
  setState: (state: IStatsPageState) => void
): void => {
  useEffect(() => {
    if(state.statuses.stats === RequestStatus.Success) {
      const updateStatuses = (statuses: any): void => {
        setState({ ...state, statuses: { ...state.statuses, ...statuses } });
      }
    
      const fetch = async (): Promise<void> => {
        try {
          if(state.offset !== null) {
            updateStatuses({ more: RequestStatus.Loading });
          }

          const res: IGetGameHistoryResponse = await GameHistoryService.get(uid, state.limit, state.offset);

          const statuses: IStatsPageStatuses = { ...state.statuses };

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
  }, [state.index, state.statuses.stats]);
}