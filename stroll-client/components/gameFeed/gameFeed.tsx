import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import { GameGroup } from "./components/gameGroup/gameGroup";
import { GettingStarted } from "../gettingStarted/gettingStarted";
import { LoadingMessage } from "../loadingMessage/loadingMessage";

import { AppContext } from "../app/contexts/appContext";

import { GameService } from "../../services/gameService";

import { GameGroupUtility } from "./utilities/gameGroupUtility";

import { IGameGroup } from "../../../stroll-models/gameGroup";
import { IGetGamesResponse } from "../../../stroll-models/getGamesResponse";

import { AppAction } from "../../enums/appAction";
import { AppStatus } from "../../enums/appStatus";
import { GameStatus } from "../../../stroll-enums/gameStatus";
import { RequestStatus } from "../../../stroll-enums/requestStatus";

interface IGameFeedState {
  groups: IGameGroup[];
  status: RequestStatus;
}

interface GameFeedProps {  
  limit: number;
}

export const GameFeed: React.FC<GameFeedProps> = (props: GameFeedProps) => { 
  const { appState, dispatchToApp } = useContext(AppContext);

  const { statuses, user } = appState;

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const [state, setState] = useState<IGameFeedState>({ 
    groups: GameGroupUtility.getInitialGroups(), 
    status: RequestStatus.Loading 
  });

  useEffect(() => {
    if(appState.status === AppStatus.SignedIn) {
      const fetch = async () => {
        try {
          dispatch(AppAction.ToggleHideFooter, true);

          let updates: IGameGroup[] = [];

          const requests: any[] = state.groups.map((group: IGameGroup) => 
            GameService.getGrouped(user.profile.uid, group.gameStatus, group.groupBy, props.limit, null));

          const responses: any = await axios.all(requests);

          responses.forEach((res: IGetGamesResponse, index: number) => {
            updates.push({ ...state.groups[index], games: res.games, requestStatus: RequestStatus.Success });
          });

          setState({ ...state, groups: updates, status: RequestStatus.Success });
          
          dispatch(AppAction.ToggleHideFooter, false);
        } catch (err) {
          console.error(err);
        }
      }

      fetch();
    }
  }, []);

  const getContent = (): JSX.Element => {
    if(state.status !== RequestStatus.Loading) {
      const hasCreatedOrJoinedGame = (): boolean => {
        return state.groups.filter((group: IGameGroup) => group.games.length > 0).length > 0;
      }

      return (
        <React.Fragment>          
          <GettingStarted hasCreatedOrJoinedGame={hasCreatedOrJoinedGame()} />
          <div className="game-feed-groups">
            <GameGroup groups={state.groups} status={GameStatus.InProgress} />
            <GameGroup groups={state.groups} status={GameStatus.Upcoming} />
            <GameGroup groups={state.groups} status={GameStatus.Completed} />
          </div>
        </React.Fragment>
      );
    }
    
    return (      
      <div className="loading-message-wrapper">
        <LoadingMessage text="Loading Games" borderless />
      </div>
    )
  }

  return (    
    <div className="game-feed">
      {getContent()}
    </div>
  )
}