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
    if(experience <= 100000) {
      return Math.round(experience / 10000) * 10000;
    }
  },
  getMinimumExperienceByLevel: (level: number): number => {
    if(level <= 12) {
      return Math.max((level * 10000) - 10000, 0);
    }

    return Math.floor(PlayerLevelUtility.getMinimumExperienceByLevel(level - 1) * 1.1);
  }
}