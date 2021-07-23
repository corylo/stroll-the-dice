import React, { createContext, useContext, useState } from "react";
import classNames from "classnames";

import { Button } from "../../../../components/buttons/button";
import { IconButton } from "../../../../components/buttons/iconButton";
import { GameDayStatus } from "../../../../components/gameDayStatus/gameDayStatus";
import { MatchupList } from "./matchupList";
import { TooltipSide } from "../../../../components/tooltip/tooltip";
import { UpdateTimer } from "../../../../components/updateTimer/updateTimer";

import { GamePageContext } from "../../gamePage";

import { useMatchupListenerEffect } from "../../effects/gamePageListenerEffects";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";
import { GameDurationUtility } from "../../../../../stroll-utilities/gameDurationUtility";
import { GamePageUtility } from "../../utilities/gamePageUtility";
import { UrlUtility } from "../../../../utilities/urlUtility";

import { defaultMatchupGroupState, IMatchupGroupState } from "../../models/matchupGroupState";

import { GameStatus } from "../../../../../stroll-enums/gameStatus";

interface IMatchupGroupContext {
  state: IMatchupGroupState;
  setState: (state: IMatchupGroupState) => void;
}

export const MatchupGroupContext = createContext<IMatchupGroupContext>(null);

interface MatchupGroupProps {  
  day: number;
}

export const MatchupGroup: React.FC<MatchupGroupProps> = (props: MatchupGroupProps) => {  
  const { day, game } = useContext(GamePageContext).state;

  const dayStatus: GameStatus = GameDurationUtility.getDayStatus(props.day, day);

  const [state, setState] = useState<IMatchupGroupState>({ 
    ...defaultMatchupGroupState(), 
    expanded: GamePageUtility.expandMatchupGroup(game.status, props.day, day, game.duration)
  });

  const setExpanded = (expanded: boolean) => setState({ ...state, expanded });

  useMatchupListenerEffect(
    state,
    props.day,
    setState
  );

  const getDate = (): string => {
    const date: Date = FirestoreDateUtility.timestampToDate(game.startsAt);

    date.setDate(date.getDate() + (props.day - 1));

    return `${date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })} ${date.toLocaleTimeString([], { hour: "numeric" })}`;
  }

  const getDayLabel = (): JSX.Element => {
    if(dayStatus === GameStatus.InProgress) {
      return <span className="highlight-main">In Progress</span>;
    } else if (game.status === GameStatus.InProgress && dayStatus === GameStatus.Upcoming) {
      return <span className="highlight-main">Up Next</span>;
    }
  }

  const getUpdateTimer = (): JSX.Element => {
    if(dayStatus === GameStatus.InProgress) {
      return (
        <UpdateTimer interval={0} />
      )
    }
  }

  const getMatchupsList = (): JSX.Element => {
    if(state.expanded) {
      return (
        <MatchupList day={props.day} />
      )
    }
  }

  const getViewButton = (): JSX.Element => {
    if(!state.expanded) {
      const text: string = day !== 0 && day + 1 === props.day
        ? "Click to predict upcoming matchups!"
        : "View Matchups";

      return (
        <Button className="view-matchups-button passion-one-font" handleOnClick={() => setExpanded(true)}>{text}</Button>
      )
    }
  }

  const getHideButton = (): JSX.Element => {
    if(state.expanded) {        
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
    <MatchupGroupContext.Provider value={{ state, setState }}>
      <div className={classNames("game-matchups", UrlUtility.format(dayStatus))}>      
        <div className="game-matchups-border" />
        <div className="game-matchups-title">
          <h1 className="game-matchups-title-text passion-one-font">Day {props.day} of {game.duration} {getDayLabel()}</h1>
          <div className="game-matchups-title-date-and-game-status">
            <h1 className="game-matchups-title-date passion-one-font">{getDate()}</h1>
            <GameDayStatus 
              day={day} 
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
    </MatchupGroupContext.Provider>
  );
}