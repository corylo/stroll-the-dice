import React, { createContext, useContext, useEffect, useState } from "react";

import { EventFilters } from "../gameTimeline/eventFilters/eventFilters";
import { GameTimeline } from "../gameTimeline/gameTimeline";
import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";

import { GamePageContext } from "../../gamePage";

import { GameEventService } from "../../../../services/gameEventService";

import { IGameEvent } from "../../../../../stroll-models/gameEvent/gameEvent";
import { defaultViewGameTimelineState, IViewGameTimelineState } from "./models/viewGameTimelineState";

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

  const updateStatus = (status: RequestStatus): void => {
    setState({ ...state, status });
  }

  useEffect(() => {
    if(toggles.events) {
      const fetch = async (): Promise<void> => {
        try {
          updateStatus(RequestStatus.Loading);

          const events: IGameEvent[] = await GameEventService.get(game.id, player.id, state.category, 10);

          setState({ ...state, events, status: RequestStatus.Success });
        } catch (err) {
          console.error(err);

          updateStatus(RequestStatus.Error);
        }
      }

      fetch();
    }
  }, [toggles.events, state.category]);

  if(toggles.events) {
    return (
      <ViewGameTimelineContext.Provider value={{ state, setState }}>
        <Modal id="view-game-timeline-modal" status={state.status}>
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