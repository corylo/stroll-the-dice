import { DateUtility } from "../../../../stroll-utilities/dateUtility";

import { GameDuration } from "../../../../stroll-enums/gameDuration";
import { GameMode } from "../../../../stroll-enums/gameMode";

export interface IGameFormStateFields {
  duration: GameDuration;
  locked: boolean;
  mode: GameMode;
  name: string;
  startsAt: string;
  startsAtHour: number;
  useMyGameDaysForJoiningPlayers: boolean;
}

export const defaultGameFormStateFields = (): IGameFormStateFields => ({
  duration: GameDuration.None,
  locked: false,
  mode: GameMode.Singles,
  name: "",
  startsAt: DateUtility.dateToInput(new Date()),
  startsAtHour: new Date().getHours() + 1,
  useMyGameDaysForJoiningPlayers: false
});