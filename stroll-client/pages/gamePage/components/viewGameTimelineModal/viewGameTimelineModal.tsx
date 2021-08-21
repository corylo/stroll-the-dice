import React, { createContext, useContext, useEffect, useState } from "react";

import { EventFilters } from "../gameTimeline/eventFilters/eventFilters";
import { GameTimeline } from "../gameTimeline/gameTimeline";
import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";

import { GamePageContext } from "../../gamePage";

import { useFetchGameEventsEffect } from "../../effects/viewGameTimelineEffects";

import { defaultViewGameTimelineState, IViewGameTimelineState } from "./models/viewGameTimelineState";

interface IViewGameTimelineContext {
  state: IViewGameTimelineState;
  setState: (state: IViewGameTimelineState) => void;
}

export const ViewGameTimelineContext = createContext<IViewGameTimelineContext>(null);

interface ViewGameTimelineModalProps {  
  back: () => void;
}

export const ViewGameTimelineModal: React.FC<ViewGameTimelineModalProps> = (props: ViewGameTimelineModalProps) => {  
  const { state: gameState } = useContext(GamePageContext);

  const { game, player, toggles } = gameState;

  const [state, setState] = useState<IViewGameTimelineState>(defaultViewGameTimelineState());

  useFetchGameEventsEffect(state, toggles, game.id, player.id, setState);

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