import React, { useContext, useState } from "react";
import classNames from "classnames";

import { EmptyMessage } from "../emptyMessage/emptyMessage";
import { GameList } from "./gameList";
import { LoadingMessage } from "../loadingMessage/loadingMessage";

import { AppContext } from "../app/contexts/appContext";

import { useFetchGameGroups } from "../../effects/gameEffects";

import { GameGroupUtility } from "./utilities/gameGroupUtility";

import { IGameGroup } from "../../../stroll-models/gameGroup";
import { defaultGameGroupState, IGameGroupState } from "../../../stroll-models/gameGroupState";

import { GameStatus } from "../../../stroll-enums/gameStatus";
import { RequestStatus } from "../../../stroll-enums/requestStatus";

interface GameGroupProps {  
  limit: number;
  status: GameStatus;
}

export const GameGroup: React.FC<GameGroupProps> = (props: GameGroupProps) => {  
  const { appState } = useContext(AppContext);

  const [state, setState] = useState<IGameGroupState>({ 
    ...defaultGameGroupState(), 
    groups: GameGroupUtility.getInitialGroups() 
  });

  useFetchGameGroups(appState, state, props.status, setState);
  
  const allGroupsEmpty = (): boolean => {
    return state.groups
      .filter((group: IGameGroup) => group.games.length === 0)
      .length === state.groups.length;
  }

  const empty: boolean = allGroupsEmpty();

  const getLists = (): JSX.Element[] => {    
    if(!empty) {
      return state.groups.map((group: IGameGroup) => {
        return (
          <GameList 
            key={group.groupBy}
            emptyMessage={GameGroupUtility.getEmptyMessage(group.groupBy, props.status)}
            games={group.games}
            title={group.groupBy} 
          />
        )
      });
    }
  }

  const getLoading = (): JSX.Element => {
    if(state.status === RequestStatus.Loading) {
      return (
        <LoadingMessage text="Loading Games" />
      )
    }
  }

  const getEmptyMessage = (): JSX.Element => {
    if(state.status !== RequestStatus.Loading && empty) {      
      return (
        <EmptyMessage text={GameGroupUtility.getAllEmptyMessage(props.status)} />
      )
    }
  }

  return (
    <div className={classNames("game-group", { loading: state.status === RequestStatus.Loading })}>
      <div className="game-group-title">
        <div className="game-group-title-border" />
        <h1 className="passion-one-font">{props.status}</h1>
      </div>
      <div className="game-group-lists">
        {getLists()}        
        {getLoading()}
        {getEmptyMessage()}
      </div>
    </div>
  );
}