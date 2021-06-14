import { IAppState } from "./appState";
import { IAction } from "../../../models/action";

export interface IAppContext {
  appState: IAppState;
  dispatchToApp: (action: IAction) => void;
}