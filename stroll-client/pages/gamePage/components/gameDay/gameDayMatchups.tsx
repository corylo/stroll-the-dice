import React, { useContext } from "react";

import { LoadingMessage } from "../../../../components/loadingMessage/loadingMessage";
import { Matchup } from "../matchup/matchup";

import { GameDayContext } from "./gameDay";
import { GamePageContext } from "../../gamePage";

import { MatchupUtility } from "../../../../utilities/matchupUtility";

import { IMatchup } from "../../../../../stroll-models/matchup";

import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface GameDayMatchupsProps {  
  day: number;
}

export const GameDayMatchups: React.FC<GameDayMatchupsProps> = (props: GameDayMatchupsProps) => {  
  const { players } = useContext(GamePageContext).state;

  const { state } = useContext(GameDayContext);

  const { matchups } = state;

  const getMatchups = (): JSX.Element[] => {
    if(
      (state.statuses.matchups === RequestStatus.Success || state.statuses.summary === RequestStatus.Success) && 
      state.statuses.predictions === RequestStatus.Success
    ) {
      const mappedMatchups: IMatchup[] = MatchupUtility.mapProfilesToMatchups(matchups, players);

      return mappedMatchups.map((matchup: IMatchup) =>       
        <Matchup 
          key={matchup.id} 
          matchup={matchup} 
          predictions={state.predictions}
        />
      );
    }
  }

  const getLoadingMessage = (): JSX.Element => {
    if(
      state.statuses.matchups === RequestStatus.Loading || 
      state.statuses.predictions === RequestStatus.Loading
    ) {
      return (
        <LoadingMessage borderless text="Loading Matchups" />
      )
    }
  }

  return (
    <div className="game-day-matchups">
      {getMatchups()}
      {getLoadingMessage()}
    </div>
  )
}