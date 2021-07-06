import React, { useContext } from "react";
import classNames from "classnames";

import { GameDayStatus } from "../../../../components/gameDayStatus/gameDayStatus";
import { Matchup } from "../matchup/matchup";

import { GamePageContext } from "../../gamePage";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";
import { GameDurationUtility } from "../../../../../stroll-utilities/gameDurationUtility";
import { UrlUtility } from "../../../../utilities/urlUtility";

import { IMatchup } from "../../../../../stroll-models/matchup";

import { GameStatus } from "../../../../../stroll-enums/gameStatus";

interface MatchupsProps {  
  day: number;
  duration: number;
  matchups: IMatchup[];
}

export const Matchups: React.FC<MatchupsProps> = (props: MatchupsProps) => {  
  const { state } = useContext(GamePageContext);

  if(props.matchups.length > 0) {
    const { game } = state;

    const dayStatus: GameStatus = GameDurationUtility.getDayStatus(props.day, state.day);

    const getMatchups = (): JSX.Element[] => {
      return props.matchups.map((matchup: IMatchup) =>       
        <Matchup key={matchup.id} dayStatus={dayStatus} matchup={matchup} />);
    }

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

    return (
      <div className={classNames("game-matchups", UrlUtility.format(dayStatus))}>
        <div className="game-matchups-title">
          <h1 className="game-matchups-title-text passion-one-font">Day {props.day} of {props.duration} {getDayLabel()}</h1>
          <h1 className="game-matchups-title-date passion-one-font">{getDate()}</h1>
          <GameDayStatus day={state.day} game={game} status={dayStatus} />
        </div>
        <div className="game-matchups-list">
          {getMatchups()}
        </div>
      </div>
    );
  }

  return null;
}