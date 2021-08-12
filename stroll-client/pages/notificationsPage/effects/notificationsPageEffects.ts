import { useEffect } from "react"

import { NotificationService } from "../../../services/notificationService";

import { IAppState } from "../../../components/app/models/appState";
import { INotification } from "../../../../stroll-models/notification";

import { AppAction } from "../../../enums/appAction";
import { AppStatus } from "../../../enums/appStatus";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export const useGetNotificationsEffect = (
  appState: IAppState, 
  limit: number,
  dispatch: (type: AppAction, payload?: any) => void
): void => {
  useEffect(() => {
    if(
      appState.status === AppStatus.SignedIn && 
      appState.user.profile.uid !== ""
    ) {
      const fetch = async (): Promise<void> => {
        try {
          dispatch(AppAction.SetNotificationsStatus, { is: RequestStatus.Loading, message: "" });

          const notifications: INotification[] = await NotificationService.getAll(appState.user.profile.uid, limit);

          dispatch(AppAction.SetNotifications, notifications);
        } catch (err) {
          console.error(err);
        }
      }

      fetch();
    }
  }, [appState.status, appState.user.profile.id]);
}