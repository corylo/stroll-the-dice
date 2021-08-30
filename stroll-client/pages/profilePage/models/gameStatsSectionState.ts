import { defaultProfileGamesStats, IProfileGamesStats } from "../../../../stroll-models/profileStats";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface IGameStatsSectionToggles {
  history: boolean;
}

export const defaultGameStatsSectionToggles = (): IGameStatsSectionToggles => ({
  history: false
})

export interface IGameStatsSectionState {
  stats: IProfileGamesStats;
  status: RequestStatus;
  toggles: IGameStatsSectionToggles;
}

export const defaultGameStatsSectionState = (): IGameStatsSectionState => ({
  stats: defaultProfileGamesStats(),
  status: RequestStatus.Loading,
  toggles: defaultGameStatsSectionToggles()
});