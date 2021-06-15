import { useEffect, useState } from "react";

import { GameService } from "../services/gameService";

import { IAppState } from "../components/app/models/appState";
import { IGame } from "../../stroll-models/game";

import { AppStatus } from "../enums/appStatus";
import { RequestStatus } from "../../stroll-enums/requestStatus";

interface IUseFetchGamesEffect {
  games: IGame[];
  status: RequestStatus;  
}

export const useFetchGamesEffect = (appState: IAppState): IUseFetchGamesEffect => {
  const { user } = appState;

  const [state, setState] = useState<IUseFetchGamesEffect>({ 
    games: [],
    status: RequestStatus.Loading
  });

  useEffect(() => {
    if(appState.status === AppStatus.SignedOut) {
      setState({ games: [], status: RequestStatus.Idle });
    }
  }, [appState.status]);

  useEffect(() => {
    if(appState.status === AppStatus.SignedIn) {
      const fetch = async (): Promise<void> => {
        try {
          const results: IGame[] = await GameService.fetchGames(user.profile.uid, 5);
          
          setState({ games: results, status: RequestStatus.Success });
        } catch (err) {
          console.error(err);

          setState({ ...state, status: RequestStatus.Error });
        }
      }

      fetch();
    }
  }, [appState.status]);
  
  return state;
}