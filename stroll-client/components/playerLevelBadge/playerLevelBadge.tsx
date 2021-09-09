import React, { useContext } from "react";
import classNames from "classnames";

import { IconButton } from "../buttons/iconButton";
import { Tooltip, TooltipSide } from "../tooltip/tooltip";

import { AppContext } from "../app/contexts/appContext";

import { PlayerLevelUtility } from "../../utilities/playerLevelUtility";

import { AppAction } from "../../enums/appAction";
import { HowToPlayID } from "../../enums/howToPlayID";

interface PlayerLevelBadgeProps {  
  experience: number;
  mini?: boolean;
}

export const PlayerLevelBadge: React.FC<PlayerLevelBadgeProps> = (props: PlayerLevelBadgeProps) => {  
  const level: number = PlayerLevelUtility.getLevelByExperience(props.experience);

  if(props.mini) {
    return (
      <div className="player-level-mini-badge">
        <i className={classNames("player-level-badge-icon", PlayerLevelUtility.getBadge(level))} />
        <h1 className="player-level-badge-label passion-one-font">{level}</h1>
        <Tooltip side={TooltipSide.Bottom} text={`Level ${level}`} />
      </div>
    );
  }

  const { dispatchToApp } = useContext(AppContext);

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const toggle = (): void => {    
    dispatch(AppAction.ToggleHowToPlay, { howToPlay: true, howToPlayID: HowToPlayID.Leveling });
  }

  return (
    <div className="player-level-badge">
      <div className="player-level-badge-content">
        <i className={classNames("player-level-badge-icon", PlayerLevelUtility.getBadge(level))} />
        <h1 className="player-level-badge-label passion-one-font">Level {level}</h1>
        <IconButton
          icon="fal fa-info-circle"
          handleOnClick={toggle}
        />
      </div>
    </div>
  )
}