import { DateUtility } from "../../../utilities/dateUtility";

import { GameDuration } from "../../../../stroll-enums/gameDuration";
import { GameMode } from "../../../../stroll-enums/gameMode";

export interface IGameFormStateFields {
  duration: GameDuration;
  mode: GameMode;
  name: string;
  startsAt: string;
}

export const defaultGameFormStateFields = (): IGameFormStateFields => ({
  duration: GameDuration.None,
  mode: GameMode.None,
  name: "",
  startsAt: DateUtility.dateToInput(new Date())
});