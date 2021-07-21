import { firestore, https, pubsub } from "firebase-functions";

import { GameService } from "./services/gameService";
import { PlayerService } from "./services/playerService";
import { PredictionService } from "./services/predictionService";
import { ProfileService } from "./services/profileService";
import { ScheduleService } from "./services/scheduleService";
import { StepTrackerService } from "./services/stepTrackerService";

exports.onProfileUpdate = firestore
  .document("profiles/{id}")
  .onUpdate(ProfileService.onUpdate);

exports.onGameCreate = firestore
  .document("games/{id}")
  .onCreate(GameService.onCreate);

exports.onGameUpdate = firestore
  .document("games/{id}")
  .onUpdate(GameService.onUpdate);

exports.onGameDelete = firestore
  .document("games/{id}")
  .onDelete(GameService.onDelete);

exports.onPlayerCreate = firestore
  .document("games/{gameID}/players/{id}")
  .onCreate(PlayerService.onCreate);
  
exports.onPlayerUpdate = firestore
  .document("games/{gameID}/players/{id}")
  .onUpdate(PlayerService.onUpdate);

exports.onPredictionCreate = firestore
  .document("games/{gameID}/matchups/{matchupID}/predictions/{id}")
  .onCreate(PredictionService.onCreate);
  
exports.onPredictionUpdate = firestore
  .document("games/{gameID}/matchups/{matchupID}/predictions/{id}")
  .onUpdate(PredictionService.onUpdate);

exports.scheduledGameUpdate = pubsub
  .schedule("0,56,57,58,59 0-23 * * *")
  .onRun(ScheduleService.scheduledGameUpdate);

/* -- Https Callable -- */

exports.connectStepTracker = https
  .onCall(StepTrackerService.connectStepTracker);
  
exports.disconnectStepTracker = https
  .onCall(StepTrackerService.disconnectStepTracker);