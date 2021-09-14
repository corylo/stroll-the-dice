import React from "react";
import classNames from "classnames";

import { PlayerLevelUtility } from "../../../utilities/playerLevelUtility";

interface PlayerLevelBadgeExperienceBarProgressPointProps {  
  experience: number;
  level: number;
  right?: boolean;
}

export const PlayerLevelBadgeExperienceBarProgressPoint: React.FC<PlayerLevelBadgeExperienceBarProgressPointProps> = (props: PlayerLevelBadgeExperienceBarProgressPointProps) => {  
  if(props.right) {
    return (
      <div className="player-level-badge-experience-bar-progress-point-wrapper right">
        <h1 className="player-level-badge-experience-bar-progress-point-experience roboto-font">{props.experience.toLocaleString()} XP</h1>
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
      <h1 className="player-level-badge-experience-bar-progress-point-experience roboto-font">{props.experience.toLocaleString()} XP</h1>
    </div>
  );
}