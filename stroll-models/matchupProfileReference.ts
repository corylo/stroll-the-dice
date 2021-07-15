import { IProfileReference } from "./profileReference";

export interface IMatchupProfileReference {
  id: string;
  left: IProfileReference;
  right: IProfileReference;
}