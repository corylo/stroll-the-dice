import { INotification } from "../../../../stroll-models/notification";

export interface INotificationTimelineGroup {
  date: string;
  notifications: INotification[];
}