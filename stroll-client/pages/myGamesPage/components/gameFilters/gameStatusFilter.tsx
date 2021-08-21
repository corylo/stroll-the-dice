import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import { FilterButton } from "../../../../components/filterButton/filterButton";

import { MyGamesPageContext } from "../../myGamesPage";

import { UrlUtility } from "../../../../utilities/urlUtility";

import { defaultMyGamesPageState } from "../../models/myGamesPageState";

import { GameStatus } from "../../../../../stroll-enums/gameStatus";

interface GameStatusFilterProps {    
  status: GameStatus;
}

export const GameStatusFilter: React.FC<GameStatusFilterProps> = (props: GameStatusFilterProps) => {  
  const { state, setState } = useContext(MyGamesPageContext);

  const history: any = useHistory();

  const changeStatus = (): void => {
    if(state.status !== props.status) {
      setState({ ...defaultMyGamesPageState(), status: props.status, groupBy: state.groupBy });

      UrlUtility.setQueryParam("status", props.status, history);
    }
  }

  return (
    <FilterButton
      selected={state.status === props.status}
      text={props.status}
      handleOnClick={changeStatus}
    />
  );
}