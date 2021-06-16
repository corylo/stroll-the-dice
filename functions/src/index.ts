import { firestore } from "firebase-functions";

import { ProfileService } from "./services/profileService";

exports.onProfileUpdate = firestore
  .document("profiles/{id}")
  .onUpdate(ProfileService.onUpdate);
