import { firestore } from "firebase-functions";

import { PlayerService } from "./services/playerService";
import { ProfileService } from "./services/profileService";

exports.onProfileUpdate = firestore
  .document("profiles/{id}")
  .onUpdate(ProfileService.onUpdate);

exports.onPlayerCreate = firestore
  .document("games/{gameID}/players/{playerID}")
  .onCreate(PlayerService.onCreate);