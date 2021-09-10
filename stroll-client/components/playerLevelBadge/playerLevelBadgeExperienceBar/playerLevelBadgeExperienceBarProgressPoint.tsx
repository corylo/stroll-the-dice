import React from "react";
import classNames from "classnames";

import { NumberUtility } from "../../../../stroll-utilities/numberUtility";
import { PlayerLevelUtility } from "../../../utilities/playerLevelUtility";

interface PlayerLevelBadgeExperienceBarProgressPointProps {  
  experience: number;
  level: number;
  right?: boolean;
}

export const PlayerLevelBadgeExperienceBarProgressPoint: React.FC<PlayerLevelBadgeExperienceBarProgressPointProps> = (props: PlayerLevelBadgeExperienceBarProgressPointProps) => {  
  const formatXP = (experience: number): string => {
    if(experience > 1000000) {
      return NumberUtility.shorten(experience);
    }

    return experience.toLocaleString();
  }

  if(props.right) {
    return (
      <div className="player-level-badge-experience-bar-progress-point-wrapper right">
        <h1 className="player-level-badge-experience-bar-progress-point-experience roboto-font">{formatXP(props.experience)} XP</h1>
        <div className="player-level-badge-experience-bar-progress-point-level">
          <h1 className="player-level-badge-progress-point-level-text roboto-font">{props.level}</h1>
          <i className={classNames("player-level-badge-progress-point-icon", PlayerLevelUtility.getBadge(props.level))} />
        </div>
      </div>
    );
  }

  return (
    <div className="player-level-badge-experience-bar-progress-point-wrapper left">
      <div className="player-level-badge-experience-bar-progress-point-level">
        <i className={classNames("player-level-badge-progress-point-icon", PlayerLevelUtility.getBadge(props.level))} />
        <h1 className="player-level-badge-progress-point-level-text roboto-font">{props.level}</h1>
      </div>
      <h1 className="player-level-badge-experience-bar-progress-point-experience roboto-font">{formatXP(props.experience)} XP</h1>
    </div>
  );
}