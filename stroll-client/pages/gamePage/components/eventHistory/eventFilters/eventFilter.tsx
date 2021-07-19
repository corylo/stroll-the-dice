import React, { useContext } from "react";
import classNames from "classnames";

import { Label } from "../../../../../components/label/label";

import { GamePageContext } from "../../../gamePage";

import { GameEventCategory } from "../../../../../../stroll-enums/gameEventCategory";

interface EventFilterProps {  
  eventCategory: GameEventCategory;
  icon: string;
  text: string;
}

export const EventFilter: React.FC<EventFilterProps> = (props: EventFilterProps) => {  
  const { state, setState } = useContext(GamePageContext);

  const update = (updates: any): void => {
    setState({ ...state, filters: { ...state.filters, ...updates } });
  }

  const selected: boolean = state.filters.eventCategory === props.eventCategory;

  return (
    <Label
      className={classNames("event-history-filter", { selected })}
      icon={props.icon}
      text={props.text}
      handleOnClick={() => update({ eventCategory: props.eventCategory })}
    />
  );
}