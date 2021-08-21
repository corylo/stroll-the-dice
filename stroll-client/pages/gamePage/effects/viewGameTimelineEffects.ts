import { useEffect } from "react";

import { GameEventService } from "../../../services/gameEventService";

import { IGamePageStateToggles } from "../models/gamePageState";
import { IGetGameEventsResponse } from "../../../../stroll-models/getGameEventsResponse";
import { defaultViewGameTimelineState, IViewGameTimelineState, IViewGameTimelineStatuses } from "../components/viewGameTimelineModal/models/viewGameTimelineState";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export const useFetchGameEventsEffect = (
  state: IViewGameTimelineState, 
  toggles: IGamePageStateToggles, 
  gameID: string,
  playerID: string,
  setState: (state: IViewGameTimelineState) => void
): void => {
  useEffect(() => {
    const updateStatuses = (statuses: any): void => {
      setState({ ...state, statuses: { ...state.statuses, ...statuses } });
    }
  
    if(toggles.events) {
      const fetch = async (): Promise<void> => {
        try {
          if(state.offset !== null) {
            updateStatuses({ more: RequestStatus.Loading });
          }

          const res: IGetGameEventsResponse = await GameEventService.get(gameID, playerID, state.category, state.limit, state.offset);

          const statuses: IViewGameTimelineStatuses = { ...state.statuses };

          if(state.offset === null) {
            statuses.initial = RequestStatus.Success;
          } else {
            statuses.more = RequestStatus.Success;
          }

          setState({ 
            ...state, 
            end: res.events.length < state.limit,
            events: [...state.events, ...res.events], 
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
  }, [toggles.events, state.category, state.index]);

  useEffect(() => {
    if(!toggles.events) {
      setState(defaultViewGameTimelineState());
    }
  }, [toggles.events]);
}