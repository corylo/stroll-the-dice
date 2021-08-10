import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import { GameGroup } from "./gameGroup";
import { LoadingMessage } from "../loadingMessage/loadingMessage";

import { AppContext } from "../app/contexts/appContext";

import { GameService } from "../../services/gameService";

import { GameGroupUtility } from "./utilities/gameGroupUtility";

import { IGame } from "../../../stroll-models/game";
import { IGameGroup } from "../../../stroll-models/gameGroup";

import { AppStatus } from "../../enums/appStatus";
import { GameStatus } from "../../../stroll-enums/gameStatus";
import { RequestStatus } from "../../../stroll-enums/requestStatus";

interface IGameConglomerateState {
  groups: IGameGroup[];
  status: RequestStatus;
}

interface GameConglomerateProps {  
  limit: number;
}

export const GameConglomerate: React.FC<GameConglomerateProps> = (props: GameConglomerateProps) => { 
  const { appState } = useContext(AppContext);

  const { user } = appState;

  const [state, setState] = useState<IGameConglomerateState>({ 
    groups: GameGroupUtility.getInitialGroups(), 
    status: RequestStatus.Loading 
  });

  useEffect(() => {
    if(appState.status === AppStatus.SignedIn) {
      const fetch = async () => {
        try {
          let updates: IGameGroup[] = [];

          const requests: any[] = state.groups.map((group: IGameGroup) => 
            GameService.getGrouped(user.profile.uid, group.gameStatus, group.groupBy, props.limit));

          const responses: any = await axios.all(requests);

          responses.forEach((res: any, index: number) => {
            updates.push({ ...state.groups[index], games: res, requestStatus: RequestStatus.Success });
          });

          setState({ ...state, groups: updates, status: RequestStatus.Success });
        } catch (err) {
          console.error(err);
        }
      }

      fetch();
    }
  }, []);

  const getContent = (): JSX.Element => {
    if(state.status !== RequestStatus.Loading) {
      return (
        <div className="game-conglomerate-groups">
          <GameGroup groups={state.groups} status={GameStatus.InProgress} />
          <GameGroup groups={state.groups} status={GameStatus.Upcoming} />
          <GameGroup groups={state.groups} status={GameStatus.Completed} />
        </div>
      );
    }
    
    return (      
      <div className="loading-message-wrapper">
        <LoadingMessage text="Loading Games" borderless />
      </div>
    )
  }

  return (    
    <div className="game-conglomerate">
      {getContent()}
    </div>
  )
}