import React, { useContext } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { IconButton } from "../buttons/iconButton";
import { PlayerLevelBadgeExperienceBar } from "./playerLevelBadgeExperienceBar/playerLevelBadgeExperienceBar";
import { Tooltip, TooltipSide } from "../tooltip/tooltip";

import { AppContext } from "../app/contexts/appContext";

import { PlayerLevelUtility } from "../../utilities/playerLevelUtility";

import { AppAction } from "../../enums/appAction";
import { Color } from "../../../stroll-enums/color";
import { HowToPlayID } from "../../enums/howToPlayID";

interface PlayerLevelBadgeProps {  
  color: Color;
  clickable?: boolean;
  experience: number;
  inline?: boolean;
  mini?: boolean;
  miniVerbose?: boolean;
}

export const PlayerLevelBadge: React.FC<PlayerLevelBadgeProps> = (props: PlayerLevelBadgeProps) => {  
  const { appState, dispatchToApp } = useContext(AppContext);

  const { toggles } = appState;

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const toggle = (): void => {    
    dispatch(AppAction.ToggleHowToPlay, { howToPlay: true, howToPlayID: HowToPlayID.Leveling });
  }

  const level: number = PlayerLevelUtility.getLevelByExperience(props.experience);

  if(props.mini || props.miniVerbose) {
    const text: string = props.miniVerbose ? `Level ${level}` : level.toString();

    if(props.clickable) {
      const handleOnClick = (): void => {
        if(toggles.menu) {
          dispatch(AppAction.ToggleMenu, false);
        }
      }
    
      return (
        <div className={classNames("player-level-mini-badge-wrapper", "clickable", { inline: props.inline })}>
          <Link to="/stats" className="player-level-mini-badge" onClick={handleOnClick}>
            <i className={classNames("player-level-badge-icon", PlayerLevelUtility.getBadge(level))} />
            <h1 className="player-level-badge-label passion-one-font">{text}</h1>
            <Tooltip side={TooltipSide.Bottom} text={`Level ${level}`} />
          </Link>  
        </div>
      )
    }

    return ( 
      <div className={classNames("player-level-mini-badge-wrapper", { inline: props.inline })} >
        <div className="player-level-mini-badge">
          <i className={classNames("player-level-badge-icon", PlayerLevelUtility.getBadge(level))} />
          <h1 className="player-level-badge-label passion-one-font">{text}</h1>
          <Tooltip side={TooltipSide.Bottom} text={`Level ${level}`} />
        </div>
      </div>
    );
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
        <PlayerLevelBadgeExperienceBar color={props.color} experience={props.experience} />
      </div>
    </div>
  )
}