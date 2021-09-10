import { playerLevelBadges } from "../../stroll-enums/playerLevelBadge";
import { PlayerLevelConstraint } from "../../stroll-enums/playerLevelConstraint";

interface IPlayerLevelUtility {    
  getBadge: (level: number) => string;  
  getLevelByExperience: (experience: number) => number;
  getMinimumExperienceByLevel: (level: number) => number;
  getNextLevelExperience: (level: number) => number;
  getNextLevelExperienceProgress: (experience: number) => number;
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
  },
  getNextLevelExperience: (level: number): number => {
    const nextLevel: number = Math.min(level + 1, PlayerLevelConstraint.MaximumLevel);
      
    return PlayerLevelUtility.getMinimumExperienceByLevel(nextLevel);
  },
  getNextLevelExperienceProgress: (experience: number): number => {
    if(experience === 0) {
      return 0;
    }

    const level: number = PlayerLevelUtility.getLevelByExperience(experience);

    if(level === PlayerLevelConstraint.MaximumLevel) {
      return 1;
    }

    const currentLevelExperience: number = PlayerLevelUtility.getMinimumExperienceByLevel(level),
      nextLevelExperience: number = PlayerLevelUtility.getNextLevelExperience(level);

    const experienceAccrued: number = experience - currentLevelExperience,
      experienceRequired: number = nextLevelExperience - currentLevelExperience;

    return experienceAccrued / experienceRequired;
  }
}