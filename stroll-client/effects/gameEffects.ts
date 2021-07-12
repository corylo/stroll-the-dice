import { useEffect } from "react";

import { GameService } from "../services/gameService";

import { IAppState } from "../components/app/models/appState";
import { IGame } from "../../stroll-models/game";
import { IGameGroup } from "../../stroll-models/gameGroup";
import { IGameGroupState } from "../../stroll-models/gameGroupState";

import { AppStatus } from "../enums/appStatus";
import { GameStatus } from "../../stroll-enums/gameStatus";
import { RequestStatus } from "../../stroll-enums/requestStatus";

export const useFetchGameGroups = (appState: IAppState, state: IGameGroupState, gameStatus: GameStatus, setState: (state: IGameGroupState) => void): void => {  
  const { user } = appState;

  useEffect(() => {
    if(appState.status === AppStatus.SignedIn) {
      const fetch = async () => {
        try {
          let updates: IGameGroup[] = [];

          for(let group of state.groups) {
            const games: IGame[] = await GameService.getGrouped(user.profile.uid, gameStatus, group.groupBy, 2);

            updates.push({ ...group, games });
          }

          setState({ ...state, groups: updates, status: RequestStatus.Success });
        } catch (err) {
          console.error(err);
        }
      }

      fetch();
    }
  }, [appState.status]);
}