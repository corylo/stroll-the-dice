import React, { createContext, useContext, useEffect, useState } from "react";

import { EventFilters } from "../gameTimeline/eventFilters/eventFilters";
import { GameTimeline } from "../gameTimeline/gameTimeline";
import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";

import { GamePageContext } from "../../gamePage";

import { GameEventService } from "../../../../services/gameEventService";

import { IGetGameEventsResponse } from "../../../../../stroll-models/getGameEventsResponse";
import { defaultViewGameTimelineState, IViewGameTimelineState, IViewGameTimelineStatuses } from "./models/viewGameTimelineState";

import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface ViewGameTimelineContext {
  state: IViewGameTimelineState;
  setState: (state: IViewGameTimelineState) => void;
}

export const ViewGameTimelineContext = createContext<ViewGameTimelineContext>(null);

interface ViewGameTimelineModalProps {  
  back: () => void;
}

export const ViewGameTimelineModal: React.FC<ViewGameTimelineModalProps> = (props: ViewGameTimelineModalProps) => {  
  const { state: gameState } = useContext(GamePageContext);

  const { game, player, toggles } = gameState;

  const [state, setState] = useState<IViewGameTimelineState>(defaultViewGameTimelineState());

  const updateStatuses = (statuses: any): void => {
    setState({ ...state, statuses: { ...state.statuses, ...statuses } });
  }

  useEffect(() => {
    if(toggles.events) {
      const fetch = async (): Promise<void> => {
        try {
          if(state.offset !== null) {
            updateStatuses({ more: RequestStatus.Loading });
          }

          const res: IGetGameEventsResponse = await GameEventService.get(game.id, player.id, state.category, state.limit, state.offset);

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

          updateStatuses(RequestStatus.Error);
        }
      }

      fetch();
    }
  }, [toggles.events, state.category, state.index]);

  if(toggles.events) {
    return (
      <ViewGameTimelineContext.Provider value={{ state, setState }}>
        <Modal id="view-game-timeline-modal" status={state.statuses.initial}>
          <ModalTitle text="Game Timeline" handleOnClose={props.back} />
          <ModalBody>       
            <EventFilters />
            <GameTimeline />
          </ModalBody>
        </Modal>
      </ViewGameTimelineContext.Provider>
    );
  }

  return null;
}