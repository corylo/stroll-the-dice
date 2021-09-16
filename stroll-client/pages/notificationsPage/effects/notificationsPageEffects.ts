import { useEffect } from "react"

import { NotificationService } from "../../../services/notificationService";

import { IGetNotificationsResponse } from "../../../../stroll-models/getNotificationsResponse";
import { INotificationsPageState, INotificationsPageStatuses } from "../models/notificationsPageState";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export const useFetchNotificationsEffect = (
  uid: string,
  state: INotificationsPageState,
  setState: (state: INotificationsPageState) => void
): void => {
  useEffect(() => {
    const updateStatuses = (statuses: any): void => {
      setState({ ...state, statuses: { ...state.statuses, ...statuses } });
    }
  
    if(uid !== "") {
      const fetch = async (): Promise<void> => {
        try {
          updateStatuses({ more: RequestStatus.Loading });

          const res: IGetNotificationsResponse = await NotificationService.getAll(uid, state.limit, state.offset);

          const statuses: INotificationsPageStatuses = { ...state.statuses };

          if(state.offset === null) {
            statuses.initial = RequestStatus.Success;
          } else {
            statuses.more = RequestStatus.Success;
          }

          setState({ 
            ...state, 
            end: res.notifications.length < state.limit,
            notifications: [...state.notifications, ...res.notifications], 
            offset: res.offset,
            statuses 
          });
        } catch (err) {
          console.error(err);

          if(state.offset === null) {
            updateStatuses({ initial: RequestStatus.Error });
          } else {
            updateStatuses({ more: RequestStatus.Error });
          }
        }
      }

      fetch();
    }
  }, [uid, state.index]);
}