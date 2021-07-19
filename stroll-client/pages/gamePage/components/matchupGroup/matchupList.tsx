import React, { useContext } from "react";

import { LoadingMessage } from "../../../../components/loadingMessage/loadingMessage";
import { Matchup } from "../matchup/matchup";

import { GamePageContext } from "../../gamePage";
import { MatchupGroupContext } from "./matchupGroup";

import { GameDurationUtility } from "../../../../../stroll-utilities/gameDurationUtility";

import { IMatchup } from "../../../../../stroll-models/matchup";

import { GameStatus } from "../../../../../stroll-enums/gameStatus";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface MatchupsListProps {  
  day: number;
}

export const MatchupList: React.FC<MatchupsListProps> = (props: MatchupsListProps) => {  
  const { state: gameState } = useContext(GamePageContext),
    { state } = useContext(MatchupGroupContext);

  const dayStatus: GameStatus = GameDurationUtility.getDayStatus(props.day, gameState.day);

  const getMatchups = (): JSX.Element[] => {
    if(state.statuses.matchups === RequestStatus.Success && state.statuses.predictions === RequestStatus.Success) {
      return state.matchups.map((matchup: IMatchup) =>       
        <Matchup 
          key={matchup.id} 
          dayStatus={dayStatus} 
          matchup={matchup} 
          predictions={state.predictions}
        />
      );
    }
  }

  const getLoadingMessage = (): JSX.Element => {
    if(state.statuses.matchups === RequestStatus.Loading || state.statuses.predictions === RequestStatus.Loading) {
      return (
        <LoadingMessage borderless text="Loading Matchups" />
      )
    }
  }

  return (
    <div className="game-matchups-list">
      {getMatchups()}
      {getLoadingMessage()}
    </div>
  )
}