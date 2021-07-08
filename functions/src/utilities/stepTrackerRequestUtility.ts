import { IGame } from "../../../stroll-models/game"
import { FirestoreDateUtility } from "../../../stroll-utilities/firestoreDateUtility"
import { GameDurationUtility } from "../../../stroll-utilities/gameDurationUtility";

interface IStepTrackerRequestUtility {
  getGoogleFitStepDataRequestBody: (game: IGame) => any;
}

export const StepTrackerRequestUtility: IStepTrackerRequestUtility = {
  getGoogleFitStepDataRequestBody: (game: IGame): any => {
    const start: Date = FirestoreDateUtility.timestampToDate(game.startsAt),
      end: Date = new Date(start),
      day: number = GameDurationUtility.getDay(game),
      hasDayPassed: boolean = GameDurationUtility.hasDayPassed(game);

    if(hasDayPassed) {
      end.setDate(end.getDate() + (day - 2));
    } else {
      end.setDate(end.getDate() + (day - 1));
    }

    end.setHours(23, 59, 59, 999);

    return {
      "aggregateBy": [{
        "dataTypeName": "com.google.step_count.delta",
        "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
      }],
      "bucketByTime": { "durationMillis": 86400000 },
      "startTimeMillis": start.getTime(),
      "endTimeMillis": end.getTime()
    }
  }
}