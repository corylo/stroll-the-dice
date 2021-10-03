import { GameFormUtility } from "../utilities/gameFormUtility";

import { GameDuration } from "../../../../stroll-enums/gameDuration";
import { GameMode } from "../../../../stroll-enums/gameMode";

export interface IGameFormStateFields {
  duration: GameDuration;
  locked: boolean;
  mode: GameMode;
  name: string;
  startsAt: string;
  startsAtHour: number;
}

export const defaultGameFormStateFields = (): IGameFormStateFields => ({
  duration: GameDuration.None,
  locked: false,
  mode: GameMode.Singles,
  name: "",
  startsAt: GameFormUtility.getStartsAt(),
  startsAtHour: GameFormUtility.getStartsAtHour()
});