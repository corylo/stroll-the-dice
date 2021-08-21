import React, { useContext } from "react";

import { FilterButton } from "../../../../../components/filterButton/filterButton";

import { ViewGameTimelineContext } from "../../viewGameTimelineModal/viewGameTimelineModal";

import { defaultViewGameTimelineState } from "../../viewGameTimelineModal/models/viewGameTimelineState";

import { GameEventCategory } from "../../../../../../stroll-enums/gameEventCategory";

interface EventFilterProps {  
  category: GameEventCategory;
  icon: string;
  text: string;
}

export const EventFilter: React.FC<EventFilterProps> = (props: EventFilterProps) => {  
  const { state, setState } = useContext(ViewGameTimelineContext);

  const changeCategory = (): void => {
    if(state.category !== props.category) {
      setState({ ...defaultViewGameTimelineState(), category: props.category });
    }
  }

  return (
    <FilterButton
      icon={props.icon}
      selected={state.category === props.category}
      text={props.text}
      handleOnClick={changeCategory}
    />
  );
}