import { playerLevelBadges } from "../../stroll-enums/playerLevelBadge";
import { PlayerLevelConstraint } from "../../stroll-enums/playerLevelConstraint";

interface IPlayerLevelUtility {    
  getBadge: (level: number) => string;
  getLevelByExperience: (experience: number) => number;
  getMinimumExperienceByLevel: (level: number) => number;
}

export const PlayerLevelUtility: IPlayerLevelUtility = {    
  getBadge: (level: number): string => {    
    return playerLevelBadges[Math.floor(level / PlayerLevelConstraint.BadgeRange)];
  },
  getLevelByExperience: (experience: number): number => {
    if(experience < PlayerLevelUtility.getMinimumExperienceByLevel(PlayerLevelConstraint.MinimumLevelForExponentialXP)) {      
      return Math.floor(experience / PlayerLevelConstraint.BaseXP) + 1;
    }

    for(let i: number = PlayerLevelConstraint.MaximumLevel; i >= PlayerLevelConstraint.MinimumLevelForExponentialXP; i--) {
      const minimum: number = PlayerLevelUtility.getMinimumExperienceByLevel(i);

      if(experience >= minimum) {
        return i;
      }
    }
  },
  getMinimumExperienceByLevel: (level: number): number => {
    if(level <= PlayerLevelConstraint.MinimumLevelForExponentialXP) {
      return Math.max((level * PlayerLevelConstraint.BaseXP) - PlayerLevelConstraint.BaseXP, 0);
    } else if (level <= (PlayerLevelConstraint.MaximumLevel - 1)) {
      return Math.floor(PlayerLevelUtility.getMinimumExperienceByLevel(level - 1) * PlayerLevelConstraint.Exponential);
    }

    return Math.floor(PlayerLevelUtility.getMinimumExperienceByLevel(PlayerLevelConstraint.MaximumLevel - 1) * 2);
  }
}