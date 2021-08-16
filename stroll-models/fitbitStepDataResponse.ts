export interface IFitbitStepDataResponseActivitiesStepsSummaryItem {
  dateTime: string;
  value: string;
}

export interface IFitbitStepDataResponse {
  "activities-steps": IFitbitStepDataResponseActivitiesStepsSummaryItem[]
}