export interface IGoogleFitStepDataResponseBucketItemDatasetPointValue {
  mapVal: []
  intVal: number;
}

export interface IGoogleFitStepDataResponseBucketItemDatasetPoint {
  startTimeNanos: string;
  originDataSourceId: string;
  endTimeNanos: string;
  value: IGoogleFitStepDataResponseBucketItemDatasetPointValue[];
  dataTypeName: string;
}

export interface IGoogleFitStepDataResponseBucketItemDataset {
  dataSourceId: string;
  point: IGoogleFitStepDataResponseBucketItemDatasetPoint[];
}

export interface IGoogleFitStepDataResponseBucketItem {
  startTimeMillis: string;
  endTimeMillis: string;
  dataset: IGoogleFitStepDataResponseBucketItemDataset[];
}

export interface IGoogleFitStepDataResponse {
  bucket: IGoogleFitStepDataResponseBucketItem[];
}