import { defaultProfileEmailSettings, IProfileEmailSettings } from "../../stroll-models/profileSettings";

import { ProfileSettingsID } from "../../stroll-enums/profileSettingsID";

interface IProfileSettingsUtility {
  mapCreate: (id: ProfileSettingsID) => IProfileEmailSettings;
}

export const ProfileSettingsUtility: IProfileSettingsUtility = {
  mapCreate: (id: ProfileSettingsID): IProfileEmailSettings => {
    switch(id) {
      case ProfileSettingsID.Email:
        return defaultProfileEmailSettings();
      default:
        throw new Error(`Unknown Profile Settings ID: ${id}`);
    }
  }
}