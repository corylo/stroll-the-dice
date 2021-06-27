import { firestore, pubsub } from "firebase-functions";

import { GameService } from "./services/gameService";
import { PlayerService } from "./services/playerService";
import { PredictionService } from "./services/predictionService";
import { ProfileService } from "./services/profileService";
import { ScheduleService } from "./services/scheduleService";

exports.onProfileUpdate = firestore
  .document("profiles/{id}")
  .onUpdate(ProfileService.onUpdate);

exports.onGameUpdate = firestore
  .document("games/{id}")
  .onUpdate(GameService.onUpdate);

exports.onPlayerCreate = firestore
  .document("games/{gameID}/players/{id}")
  .onCreate(PlayerService.onCreate);
  
exports.onPredictionCreate = firestore
  .document("games/{gameID}/matchups/{matchupID}/predictions/{id}")
  .onCreate(PredictionService.onCreate);
  
exports.onPredictionUpdate = firestore
  .document("games/{gameID}/matchups/{matchupID}/predictions/{id}")
  .onUpdate(PredictionService.onUpdate);

exports.scheduledFunction = pubsub
  .schedule("every 1 hours")
  .onRun(ScheduleService.updateGameStatuses);