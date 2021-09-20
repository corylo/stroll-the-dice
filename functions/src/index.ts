import { auth, firestore, https, pubsub } from "firebase-functions";

import { AuthService } from "./services/authService";
import { FriendRequestService } from "./services/friendRequestService";
import { GameDayTransactionService } from "./services/transaction/gameDayTransactionService";
import { GameService } from "./services/gameService";
import { PaymentService } from "./services/paymentService";
import { PlayerService } from "./services/playerService";
import { PredictionService } from "./services/predictionService";
import { ProfileService } from "./services/profileService";
import { ScheduleService } from "./services/scheduleService";
import { StepTrackerService } from "./services/stepTrackerService";
import { StripeService } from "./services/stripeService";
import { MatchupService } from "./services/matchupService";

exports.onAuthUserDelete = auth.user()
  .onDelete(AuthService.onAuthUserDelete);

/* -- Firestore Event Listeners -- */

exports.onProfileCreate = firestore
  .document("profiles/{id}")
  .onCreate(ProfileService.onCreate);

exports.onFriendRequestCreation = firestore
  .document("profiles/{profileID}/friend_requests/{requestID}")
  .onCreate(FriendRequestService.onCreate);

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

exports.onPlayerUpdate = firestore
  .document("games/{gameID}/players/{id}")
  .onUpdate(PlayerService.onUpdate);

  exports.onMatchupUpdate = firestore
  .document("games/{gameID}/matchups/{matchupID}")
  .onUpdate(MatchupService.onUpdate);

exports.onMatchupCreate = firestore
  .document("games/{gameID}/matchups/{matchupID}")
  .onCreate(MatchupService.onCreate);
  
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
  
exports.createPaymentSession = https
  .onCall(PaymentService.createPaymentSession);

exports.giftGameDays = https
  .onCall(GameDayTransactionService.giftGameDays);

// exports.updateUserEmail = https
//   .onCall(UserService.updateEmail);
  
/* -- Web Hooks -- */

exports.stripePaymentWebhook = https
  .onRequest(StripeService.paymentWebhook);