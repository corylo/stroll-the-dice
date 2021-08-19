import React, { useContext } from "react";
import classNames from "classnames";

import { Label } from "../../../../../components/label/label";

import { ViewGameTimelineContext } from "../../viewGameTimelineModal/viewGameTimelineModal";

import { GameEventCategory } from "../../../../../../stroll-enums/gameEventCategory";

interface EventFilterProps {  
  category: GameEventCategory;
  icon: string;
  text: string;
}

export const EventFilter: React.FC<EventFilterProps> = (props: EventFilterProps) => {  
  const { state, setState } = useContext(ViewGameTimelineContext);

  const updateCategory = (): void => {
    setState({ ...state, category: props.category });
  }

  const selected: boolean = state.category === props.category;

  return (
    <Label
      className={classNames("event-history-filter", { selected })}
      icon={props.icon}
      text={props.text}
      handleOnClick={updateCategory}
    />
  );
}