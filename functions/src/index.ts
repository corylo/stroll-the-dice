import { auth, firestore, https, pubsub } from "firebase-functions";

import { AuthService } from "./services/authService";
import { GameService } from "./services/gameService";
import { PaymentService } from "./services/paymentService";
import { PlayerService } from "./services/playerService";
import { PredictionService } from "./services/predictionService";
import { ProfileService } from "./services/profileService";
import { ScheduleService } from "./services/scheduleService";
import { StepTrackerService } from "./services/stepTrackerService";
import { StripeService } from "./services/stripeService";

exports.onAuthUserDelete = auth.user()
  .onDelete(AuthService.onAuthUserDelete);

/* -- Firestore Event Listeners -- */

exports.onProfileCreate = firestore
  .document("profiles/{id}")
  .onCreate(ProfileService.onCreate);

exports.onProfileUpdate = firestore
  .document("profiles/{id}")
  .onUpdate(ProfileService.onUpdate);

exports.onPaymentCreation = firestore
  .document("profiles/{profileID}/payments/{paymentID}")
  .onCreate(PaymentService.onCreate);

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
  
exports.onPredictionCreate = firestore
  .document("games/{gameID}/matchups/{matchupID}/predictions/{id}")
  .onCreate(PredictionService.onCreate);
  
exports.onPredictionUpdate = firestore
  .document("games/{gameID}/matchups/{matchupID}/predictions/{id}")
  .onUpdate(PredictionService.onUpdate);

/* -- Firestore Scheduled Functions -- */

exports.scheduledGameUpdate = pubsub
  .schedule("0,56,57,58,59 0-23 * * *")
  .onRun(ScheduleService.scheduledGameUpdate);

/* -- Https Callable -- */

exports.connectStepTracker = https
  .onCall(StepTrackerService.connectStepTracker);
  
exports.verifyStepTracker = https
  .onCall(StepTrackerService.verifyStepTracker);

exports.disconnectStepTracker = https
  .onCall(StepTrackerService.disconnectStepTracker);
  
// exports.updateUserEmail = https
//   .onCall(UserService.updateEmail);
  
exports.createPaymentSession = https
  .onCall(PaymentService.createPaymentSession);

exports.stripePaymentWebhook = https
  .onRequest(StripeService.paymentWebhook);