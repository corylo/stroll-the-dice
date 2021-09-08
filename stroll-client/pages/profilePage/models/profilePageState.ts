import { defaultProfileSettings, IProfileSettings } from "../../../../stroll-models/profileSettings";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface IProfilePageStatuses {
  loadingSettings: RequestStatus;
  savingSettings: RequestStatus;
}

export const defaultProfilePageStatuses = (): IProfilePageStatuses => ({
  loadingSettings: RequestStatus.Loading,
  savingSettings: RequestStatus.Idle
});

export interface IProfilePageState {
  settings: IProfileSettings;
  statuses: IProfilePageStatuses;
}

export const defaultProfilePageState = (): IProfilePageState => ({
  settings: defaultProfileSettings(),
  statuses: defaultProfilePageStatuses()
});