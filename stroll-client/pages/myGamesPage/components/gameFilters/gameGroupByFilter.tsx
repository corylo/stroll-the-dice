import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import { FilterButton } from "../../../../components/filterButton/filterButton";

import { MyGamesPageContext } from "../../myGamesPage";

import { UrlUtility } from "../../../../utilities/urlUtility";

import { defaultMyGamesPageState } from "../../models/myGamesPageState";

import { GroupGameBy } from "../../../../../stroll-enums/groupGameBy";

interface GameGroupByFilterProps {    
  groupBy: GroupGameBy;
}

export const GameGroupByFilter: React.FC<GameGroupByFilterProps> = (props: GameGroupByFilterProps) => {  
  const { state, setState } = useContext(MyGamesPageContext);

  const history: any = useHistory();

  const changeStatus = (): void => {
    if(state.groupBy !== props.groupBy) {
      setState({ ...defaultMyGamesPageState(), groupBy: props.groupBy, status: state.status });

      UrlUtility.setQueryParam("type", props.groupBy, history);
    }
  }

  return (
    <FilterButton
      selected={state.groupBy === props.groupBy}
      text={props.groupBy}
      handleOnClick={changeStatus}
    />
  );
}