import React, { useContext } from "react";

import { Matchup } from "../matchup/matchup";

import { GamePageContext } from "../../gamePage";

import { FirestoreDateUtility } from "../../../../utilities/firestoreDateUtility";

import { IMatchup } from "../../../../../stroll-models/matchup";

interface MatchupsProps {  
  day: number;
  matchups: IMatchup[];
}

export const Matchups: React.FC<MatchupsProps> = (props: MatchupsProps) => {  
  const { state } = useContext(GamePageContext);

  if(props.matchups.length > 0) {
    const getMatchups = (): JSX.Element[] => {
      return props.matchups.map((matchup: IMatchup) =>       
        <Matchup key={matchup.id} matchup={matchup} />);
    }

    const getDate = (): string => {
      const date: Date = FirestoreDateUtility.timestampToDate(state.game.startsAt);

      date.setDate(date.getDate() + (props.day - 1));

      return date.toDateString();
    }

    return (
      <div className="game-matchups">
        <div className="game-matchups-title">
          <h1 className="passion-one-font game-matchups-title-text">Day {props.day}</h1>
          <h1 className="passion-one-font game-matchups-title-date">{getDate()}</h1>
        </div>
        <div className="game-matchups-list">
          {getMatchups()}
        </div>
      </div>
    );
  }

  return null;
}