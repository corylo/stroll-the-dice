import { IProfile } from "../../../../stroll-models/profile";
import { IStepTrackerProfileReference } from "../../../../stroll-models/stepTrackerProfileReference";

import { Icon } from "../../../../stroll-enums/icon";
import { StepTracker } from "../../../../stroll-enums/stepTracker";

interface IGettingStartedUtility {
  hasCompletedProfileCustomizationStep: (profile: IProfile) => boolean;
  hasCompletedStepTrackerConnectionStep: (tracker: IStepTrackerProfileReference) => boolean;
  showGettingStarted: (profile: IProfile, hasCreatedOrJoinedGame: boolean) => boolean;
}

export const GettingStartedUtility: IGettingStartedUtility = {
  hasCompletedProfileCustomizationStep: (profile: IProfile): boolean => {
    return (
      profile.icon !== Icon.User ||
      profile.username !== `Player ${profile.friendID}`
    );
  },
  hasCompletedStepTrackerConnectionStep: (tracker: IStepTrackerProfileReference): boolean => {
    return tracker.name !== StepTracker.Unknown;
  },
  showGettingStarted: (profile: IProfile, hasCreatedOrJoinedGame: boolean): boolean => {
    return (
      !GettingStartedUtility.hasCompletedProfileCustomizationStep(profile) ||
      !GettingStartedUtility.hasCompletedStepTrackerConnectionStep(profile.tracker) ||
      !hasCreatedOrJoinedGame
    )
  }
}