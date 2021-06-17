import { useEffect, useState } from "react";

import { IAppState } from "../components/app/models/appState";
import { IGame } from "../../stroll-models/game";

import { AppStatus } from "../enums/appStatus";
import { RequestStatus } from "../../stroll-enums/requestStatus";

interface IUseFetchGamesEffect {
  games: IGame[];
  status: RequestStatus;  
}

export const useFetchGamesEffect = (
  appState: IAppState, 
  limit: number, 
  get: (uid: string, limit: number) => Promise<IGame[]>
): IUseFetchGamesEffect => {
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
          const results: IGame[] = await get(user.profile.uid, limit);
          
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