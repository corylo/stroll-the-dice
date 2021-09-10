import React, { useEffect, useState } from "react";

import { PlayerLevelBadgeExperienceBarProgressPoint } from "./playerLevelBadgeExperienceBarProgressPoint";

import { PlayerLevelUtility } from "../../../utilities/playerLevelUtility";

import { Color } from "../../../../stroll-enums/color";
import { PlayerLevelConstraint } from "../../../../stroll-enums/playerLevelConstraint";

interface IExperienceBarStyles {
  bar: React.CSSProperties;
  indicator: React.CSSProperties;
}

interface PlayerLevelBadgeExperienceBarProps {  
  color: Color;
  experience: number;
}

export const PlayerLevelBadgeExperienceBar: React.FC<PlayerLevelBadgeExperienceBarProps> = (props: PlayerLevelBadgeExperienceBarProps) => {    
  const [styles, setStyles] = useState<IExperienceBarStyles>({ 
    bar: { width: "0%" }, 
    indicator: { left: "0%" } 
  });

  useEffect(() => {
    setTimeout(() => {
      const progress: number = PlayerLevelUtility.getNextLevelExperienceProgress(props.experience),
        percentage: number = progress * 100;

      const barBackground: string = `repeating-linear-gradient(
        135deg, 
        rgba(${props.color}, 0.90) 25%, 
        rgba(${props.color}, 0.60) 25%, 
        rgba(${props.color}, 0.60) 50%, 
        rgba(${props.color}, 0.90) 50%, 
        rgba(${props.color}, 0.90) 75%, 
        rgba(${props.color}, 0.60) 75%
      )`;

      const bar: React.CSSProperties = { background: barBackground, width: `${percentage}%` },
        indicator: React.CSSProperties = { left: `${percentage}%`};

      setStyles({ bar, indicator });
    }, 10);
  }, []);

  const level: number = PlayerLevelUtility.getLevelByExperience(props.experience),
    nextLevel: number = Math.min(level + 1, PlayerLevelConstraint.MaximumLevel),
    currentLevelExperience: number = PlayerLevelUtility.getMinimumExperienceByLevel(level),
    nextLevelExperience: number = PlayerLevelUtility.getNextLevelExperience(level);

  return (
    <div className="player-level-badge-experience-bar-outer-wrapper">      
      <div className="player-level-badge-experience-bar-content-wrapper">      
        <div className="player-level-badge-experience-bar-content">
          <div className="player-level-badge-experience-bar-progress-point" />
          <div className="player-level-badge-experience-bar-wrapper">
            <div className="player-level-badge-experience-bar" style={styles.bar} />          
            <i className="player-level-badge-experience-bar-indicator fas fa-map-marker" style={styles.indicator} />
          </div>
          <div className="player-level-badge-experience-bar-progress-point" />
        </div>
        <div className="player-level-badge-experience-bar-progress-points">
          <PlayerLevelBadgeExperienceBarProgressPoint color={props.color} experience={currentLevelExperience} level={level} />
          <PlayerLevelBadgeExperienceBarProgressPoint color={props.color} experience={nextLevelExperience} level={nextLevel} right />
        </div>
      </div>
    </div>
  )
}