import React, { useContext, useState } from "react";
import classNames from "classnames";

import { Button } from "../../../../components/buttons/button";
import { IconButton } from "../../../../components/buttons/iconButton";
import { GameDayStatus } from "../../../../components/gameDayStatus/gameDayStatus";
import { MatchupList } from "./matchupList";
import { TooltipSide } from "../../../../components/tooltip/tooltip";
import { UpdateTimer } from "../../../../components/updateTimer/updateTimer";

import { GamePageContext } from "../../gamePage";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";
import { GameDurationUtility } from "../../../../../stroll-utilities/gameDurationUtility";
import { GamePageUtility } from "../../utilities/gamePageUtility";
import { UrlUtility } from "../../../../utilities/urlUtility";

import { GameStatus } from "../../../../../stroll-enums/gameStatus";

interface MatchupGroupProps {  
  day: number;
}

export const MatchupGroup: React.FC<MatchupGroupProps> = (props: MatchupGroupProps) => {  
  const { state: gameState } = useContext(GamePageContext);

  const { game } = gameState,
    dayStatus: GameStatus = GameDurationUtility.getDayStatus(props.day, gameState.day);

  const [expanded, setExpanded] = useState<boolean>(GamePageUtility.expandMatchupGroup(game.status, props.day, gameState.day, game.duration));

  const getDate = (): string => {
    const date: Date = FirestoreDateUtility.timestampToDate(game.startsAt);

    date.setDate(date.getDate() + (props.day - 1));

    return date.toDateString();
  }

  const getDayLabel = (): JSX.Element => {
    if(dayStatus === GameStatus.InProgress) {
      return <span className="highlight-main">Today</span>;
    } else if (game.status === GameStatus.InProgress && dayStatus === GameStatus.Upcoming) {
      return <span className="highlight-main">Tomorrow</span>;
    }
  }

  const getUpdateTimer = (): JSX.Element => {
    if(dayStatus === GameStatus.InProgress) {
      return (
        <UpdateTimer />
      )
    }
  }

  const getMatchupsList = (): JSX.Element => {
    if(expanded) {
      return (
        <MatchupList day={props.day} />
      )
    }
  }

  const getViewButton = (): JSX.Element => {
    if(!expanded) {
      const text: string = gameState.day !== 0 && gameState.day + 1 === props.day
        ? "Click to predict tomorrow's matchups!"
        : "View Matchups";

      return (
        <Button className="view-matchups-button passion-one-font" handleOnClick={() => setExpanded(true)}>{text}</Button>
      )
    }
  }

  const getHideButton = (): JSX.Element => {
    if(expanded) {        
      return (
        <IconButton 
          className="hide-matchups-button"
          icon="fal fa-horizontal-rule" 
          tooltip="Hide"
          tooltipSide={TooltipSide.Left}
          handleOnClick={() => setExpanded(false)}
        />    
      )
    }
  }

  return (
    <div className={classNames("game-matchups", UrlUtility.format(dayStatus))}>
      <div className="game-matchups-title">
        <h1 className="game-matchups-title-text passion-one-font">Day {props.day} of {gameState.game.duration} {getDayLabel()}</h1>
        <div className="game-matchups-title-date-and-game-status">
          <h1 className="game-matchups-title-date passion-one-font">{getDate()}</h1>
          <GameDayStatus 
            day={gameState.day} 
            game={game} 
            dayStatus={dayStatus} 
          />
        </div>
        {getUpdateTimer()}          
        {getHideButton()}
      </div>
      {getMatchupsList()}
      {getViewButton()}
    </div>
  );
}