import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { InviteService } from "../../../services/inviteService";

import { GameDurationUtility } from "../../../../stroll-utilities/gameDurationUtility";
import { InviteUtility } from "../../../utilities/inviteUtility";
import { RoleUtility } from "../../../../stroll-utilities/roleUtility";
import { UrlUtility } from "../../../utilities/urlUtility";

import { IAppState } from "../../../components/app/models/appState";
import { IGamePageState } from "../models/gamePageState";
import { IInvite } from "../../../../stroll-models/invite";

import { AppAction } from "../../../enums/appAction";
import { AppStatus } from "../../../enums/appStatus";
import { PlayerStatus } from "../../../../stroll-enums/playerStatus";

export const useUpdateCurrentDayEffect = (state: IGamePageState, setState: (state: IGamePageState) => void): void => {      
  useEffect(() => {
    if(state.game.id !== "") {
      const interval: NodeJS.Timeout = setInterval(() => {      
        const day: number = GameDurationUtility.getDay(state.game);
        
        if(state.day !== day) {
          setState({ ...state, day });
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [state]);
}

export const useGameInviteEffect = (
  appState: IAppState, 
  state: IGamePageState,   
  dispatch: (type: AppAction, payload?: any) => void,
  setState: (state: IGamePageState) => void
): void => {
  const [inviteID] = useState<string>(UrlUtility.getQueryParam("invite"));

  const history: any = useHistory();

  const { user } = appState;

  useEffect(() => {
    const load = async (): Promise<void> => {
      const showInvite: boolean = InviteUtility.showInvite(inviteID, state.creator, state.statuses.player);

      if(showInvite && RoleUtility.isAdmin(user.roles)) {
        dispatch(AppAction.ToggleAcceptInvite, true);
      } else if (showInvite) {
        try {
          const invite: IInvite = await InviteService.get.by.id(state.game, inviteID);

          dispatch(AppAction.ToggleAcceptInvite, true);

          setState({ ...state, invite });
        } catch (err) {
          console.error(err);
        }
      } else if (inviteID && appState.status === AppStatus.SignedOut) {
        dispatch(AppAction.ToggleSignIn, true);
      } else if (state.statuses.player === PlayerStatus.Playing) {
        UrlUtility.clearParam(history, "invite");
      }
    }

    load();
  }, [appState.status, user.roles, state.statuses.player, state.creator]);
}