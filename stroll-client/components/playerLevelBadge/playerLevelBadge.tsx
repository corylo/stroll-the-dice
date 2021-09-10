import React, { useContext } from "react";
import { useHistory } from "react-router";
import classNames from "classnames";

import { IconButton } from "../buttons/iconButton";
import { PlayerLevelBadgeExperienceBar } from "./playerLevelBadgeExperienceBar/playerLevelBadgeExperienceBar";
import { Tooltip, TooltipSide } from "../tooltip/tooltip";

import { AppContext } from "../app/contexts/appContext";

import { PlayerLevelUtility } from "../../utilities/playerLevelUtility";

import { AppAction } from "../../enums/appAction";
import { HowToPlayID } from "../../enums/howToPlayID";

interface PlayerLevelBadgeProps {  
  clickable?: boolean;
  experience: number;
  mini?: boolean;
  miniVerbose?: boolean;
}

export const PlayerLevelBadge: React.FC<PlayerLevelBadgeProps> = (props: PlayerLevelBadgeProps) => {  
  const history: any = useHistory();

  const level: number = PlayerLevelUtility.getLevelByExperience(props.experience);

  const handleOnClick = (): void => {
    if(props.clickable) {
      history.push("/stats");
    }
  }

  if(props.mini || props.miniVerbose) {
    const text: string = props.miniVerbose ? `Level ${level}` : level.toString();

    return ( 
      <div className={classNames("player-level-mini-badge-wrapper", { clickable: props.clickable })} onClick={handleOnClick}>
        <div className="player-level-mini-badge">
          <i className={classNames("player-level-badge-icon", PlayerLevelUtility.getBadge(level))} />
          <h1 className="player-level-badge-label passion-one-font">{text}</h1>
          <Tooltip side={TooltipSide.Bottom} text={`Level ${level}`} />
        </div>
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
        <div className="player-level-badge-level-content">
          <i className={classNames("player-level-badge-icon", PlayerLevelUtility.getBadge(level))} />
          <h1 className="player-level-badge-label passion-one-font">Level {level}</h1>
          <IconButton
            icon="fal fa-info-circle"
            handleOnClick={toggle}
          />
        </div>
        <h1 className="player-level-badge-experience-label roboto-font">{props.experience.toLocaleString()} XP</h1>
        <PlayerLevelBadgeExperienceBar experience={props.experience} />
      </div>
    </div>
  )
}