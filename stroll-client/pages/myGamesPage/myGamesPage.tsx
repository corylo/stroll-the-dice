import React, { createContext, useContext, useEffect, useState } from "react";

import { Button } from "../../components/buttons/button";
import { GameFilters } from "./components/gameFilters/gameFilters";
import { GameList } from "../../components/gameGroup/gameList";
import { LoadingIcon } from "../../components/loadingIcon/loadingIcon";
import { Page } from "../../components/page/page";
import { PageTitle } from "../../components/page/pageTitle";

import { AppContext } from "../../components/app/contexts/appContext";

import { useFetchGamesEffect } from "./effects/myGamesPageEffects";

import { GameGroupUtility } from "../../components/gameGroup/utilities/gameGroupUtility";
import { GameStatusUtility } from "../../utilities/gameStatusUtility";
import { UrlUtility } from "../../utilities/urlUtility";

import { defaultMyGamesPageState, IMyGamesPageState } from "./models/myGamesPageState";

import { GameStatus } from "../../../stroll-enums/gameStatus";
import { GroupGameBy } from "../../../stroll-enums/groupGameBy";
import { RequestStatus } from "../../../stroll-enums/requestStatus";

interface IMyGamesPageContext {
  state: IMyGamesPageState;
  setState: (state: IMyGamesPageState) => void;
}

export const MyGamesPageContext = createContext<IMyGamesPageContext>(null);

interface MyGamesPageProps {
  
}

export const MyGamesPage: React.FC<MyGamesPageProps> = (props: MyGamesPageProps) => {
  const { profile } = useContext(AppContext).appState.user;
  
  const [state, setState] = useState<IMyGamesPageState>(defaultMyGamesPageState());

  useFetchGamesEffect(state, profile.uid, setState);

  useEffect(() => {
    const status: GameStatus = GameStatusUtility.getStatusFromQueryParam(UrlUtility.getQueryParam("status")),
      groupBy: GroupGameBy = GameStatusUtility.getGroupByFromQueryParam(UrlUtility.getQueryParam("type"));

    setState({...state, groupBy, status });
  }, []);

  const getGameList = (): JSX.Element => {
    if(state.status !== null && state.statuses.initial !== RequestStatus.Loading) {
      return ( 
        <GameList         
          emptyMessage={GameGroupUtility.getEmptyMessage(state.groupBy, state.status)}
          games={state.games}
          title={GroupGameBy.Hosting} 
        />
      )
    }
  }

  const getLoadingIcon = (): JSX.Element => {
    if(state.statuses.initial === RequestStatus.Loading || state.statuses.more === RequestStatus.Loading) {
      return (
        <div className="games-loading-icon">
          <LoadingIcon />
        </div>
      )
    }
  }

  const getViewMoreButton = (): JSX.Element => {
    if(
      state.statuses.more !== RequestStatus.Loading && 
      state.games.length !== 0 &&
      !state.end
    ) {
      return (        
        <Button 
          className="view-more-button passion-one-font" 
          handleOnClick={() => setState({ ...state, index: state.index + 1 })}
        >
          View more
        </Button>
      )
    }
  }

  return(
    <MyGamesPageContext.Provider value={{ state, setState }}>
      <Page 
        id="my-games-page" 
        backgroundGraphic=""
        requireAuth
      >   
        <PageTitle text={state.status} />
        <GameFilters />
        <div className="my-games">
          {getGameList()}
          {getLoadingIcon()}
          {getViewMoreButton()}
        </div>
      </Page>
    </MyGamesPageContext.Provider>
  )
}